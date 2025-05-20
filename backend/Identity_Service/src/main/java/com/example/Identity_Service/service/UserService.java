package com.example.Identity_Service.service;

import com.example.Identity_Service.FileUtils;
import com.example.Identity_Service.constant.PredefinedRole;
import com.example.Identity_Service.dto.request.ChangePasswordRequest;
import com.example.Identity_Service.dto.request.UserCreationRequest;
import com.example.Identity_Service.dto.request.UserUpdateRequest;
import com.example.Identity_Service.dto.response.PageResponse;
import com.example.Identity_Service.dto.response.ReviewerResponse;
import com.example.Identity_Service.dto.response.UserResponse;
import com.example.Identity_Service.entity.Role;
import com.example.Identity_Service.entity.User;
import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import com.example.Identity_Service.mapper.ProfileClientMapper;
import com.example.Identity_Service.mapper.UserMapper;
import com.example.Identity_Service.repository.ProfileClientHttp;
import com.example.Identity_Service.repository.RoleRepository;
import com.example.Identity_Service.repository.UserRepository;
import com.example.event.dto.NotificationRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {

    UserRepository userRepository;
    UserMapper userMapper;
    ProfileClientMapper profileClientMapper;
    ProfileClientHttp profileClientHttp;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    KafkaTemplate<String, Object> kafkaTemplate;
    RedisTemplate<String, Object> redisTemplate;
    ObjectMapper objectMapper;

    // Create a new user
    @CacheEvict(value = {"usersList", "usersPage"}, allEntries = true)
    public UserResponse createUser(UserCreationRequest request, MultipartFile part) throws JsonProcessingException {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }

        Optional<User> userOp = userRepository.findByEmail(request.getEmail());
        if (userOp.isPresent() && userOp.get().getPassword() != null) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        request.setPassword(passwordEncoder.encode(request.getPassword()));
        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);

        User user = userMapper.ToUser(request);
        user.setRoles(roles);
        user.setActive(true);

        // Handle avatar upload
        if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            String avatarUrl = FileUtils.saveImage(part);
            user.setAvatar(avatarUrl);
        }

        User savedUser = userRepository.save(user);

        // Cache user in Redis
        String cacheKey = "USER_" + savedUser.getEmail();
        redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(savedUser));

        // Create associated profile
        com.example.Identity_Service.dto.request.CreationProfileRequest profileRq = profileClientMapper.toCreateProfileRequest(request);
        profileRq.setId_user(savedUser.getId_user());
        profileClientHttp.createProfile(profileRq);

        // Send notification
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .nameReceptor(savedUser.getUsername())
                .emailReceptor(savedUser.getEmail())
                .subject("Thông báo tạo tài khoản thành công")
                .textContent("Chúc mừng bạn đã tạo tài khoản thành công. \n"
                        + "Tên tài khoản: " + savedUser.getUsername() + "\n"
                        + "Ngày tạo: " + LocalDate.now() + ".")
                .build();
        kafkaTemplate.send("user-created", notificationRequest);

        return userMapper.toUserResponse(savedUser);
    }

    // Get all users with pagination and keyword search
    @Cacheable(value = "usersPage", key = "#keyword + '_' + #page + '_' + #size")
    public PageResponse<UserResponse> getAllUsers(String keyword, int page, int size) {
        log.info("Fetching users from DB for keyword: {}, page: {}, size: {}", keyword, page, size);
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<User> userPage = userRepository.searchUsers(keyword, pageable);

        List<UserResponse> userResponses = userPage.getContent()
                .stream()
//                .filter(User::isActive)
                .map(userMapper::toUserResponse)
                .toList();

        return PageResponse.<UserResponse>builder()
                .currentPage(page)
                .totalPages(userPage.getTotalPages())
                .totalElements(userPage.getTotalElements())
                .elements(userResponses)
                .build();
    }

    // Update user by admin
    @CacheEvict(value = {"users", "usersPage", "usersList", "reviewers"}, allEntries = true)
    public void updateUser(String userId, UserUpdateRequest request, MultipartFile part) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_NOT_ACTIVE);
        }
        // Handle avatar upload
            String avatarUrl = FileUtils.saveImage(part);
            request.setAvatar(avatarUrl);

        userMapper.updateUser(user, request);
        User savedUser = userRepository.save(user);

        // Update Redis cache
        String cacheKey = "USER_" + savedUser.getEmail();
        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(savedUser));
        } catch (JsonProcessingException e) {
            log.error("Error updating Redis cache: {}", e.getMessage());
        }
    }

    // Soft delete user
    @CacheEvict(value = {"users", "usersPage", "usersList", "reviewers"}, allEntries = true)
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_ALREADY_INACTIVE);
        }
        user.setActive(false);
        User savedUser = userRepository.save(user);
        // Evict individual user cache
        String cacheKey = "USER_" + savedUser.getEmail();
        redisTemplate.delete(cacheKey);
        log.info("Deleted user ID: {}, email: {}, cache key: {}", id, savedUser.getEmail(), cacheKey);
    }

    // Restore deleted user
    @CacheEvict(value = {"usersPage", "usersList"}, allEntries = true)
    public void restoreUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (user.isActive()) {
            throw new AppException(ErrorCode.USER_ALREADY_ACTIVE);
        }
        user.setActive(true);
        User savedUser = userRepository.save(user);
        // Update Redis cache
        String cacheKey = "USER_" + savedUser.getEmail();
        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(savedUser));
            log.info("Restored user ID: {}, email: {}, cache key: {}", id, savedUser.getEmail(), cacheKey);
        } catch (JsonProcessingException e) {
            log.error("Error updating Redis cache: {}", e.getMessage());
        }
    }

    // Get user by ID
    @Cacheable(value = "users", key = "#id")
    public UserResponse getUserById(String id) {
        log.info("Fetching user from DB with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_NOT_ACTIVE);
        }
        return userMapper.toUserResponse(user);
    }

    // Update email
    @CacheEvict(value = {"users", "usersPage", "usersList", "reviewers"}, allEntries = true)
    public void updateEmail(String id_user, String newEmail) {
        User user = userRepository.findById(id_user)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_NOT_ACTIVE);
        }
        String oldEmail = user.getEmail();
        user.setEmail(newEmail);
        User savedUser = userRepository.save(user);
        // Update Redis cache and remove old cache
        try {
            String newCacheKey = "USER_" + newEmail;
            redisTemplate.opsForValue().set(newCacheKey, objectMapper.writeValueAsString(savedUser));
            redisTemplate.delete("USER_" + oldEmail);
            log.info("Updated email for user ID: {}, old email: {}, new email: {}", id_user, oldEmail, newEmail);
        } catch (JsonProcessingException e) {
            log.error("Error updating Redis cache: {}", e.getMessage());
        }
    }

    // Get reviewer information
    @Cacheable(value = "reviewers", key = "#id")
    public ReviewerResponse getReviewer(String id) {
        log.info("Fetching reviewer from DB with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_NOT_ACTIVE);
        }
        return ReviewerResponse.builder()
                .id_user(user.getId_user())
                .username(user.getUsername())
                .avatar(user.getAvatar())
                .build();
    }

    // Update avatar
    @CacheEvict(value = {"users", "usersPage", "usersList", "reviewers"}, allEntries = true)
    public UserResponse saveImage(String url, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_NOT_ACTIVE);
        }
        user.setAvatar(url);
        User savedUser = userRepository.save(user);
        // Update Redis cache
        String cacheKey = "USER_" + savedUser.getEmail();
        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(savedUser));
        } catch (JsonProcessingException e) {
            log.error("Error updating Redis cache: {}", e.getMessage());
        }
        return userMapper.toUserResponse(savedUser);
    }

    // Change password
    @CacheEvict(value = {"users", "usersPage", "usersList"}, allEntries = true)
    public void changePassword(String idUser, ChangePasswordRequest request) {
        User user = userRepository.findById(idUser)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_NOT_ACTIVE);
        }

        PasswordEncoder encoder = new BCryptPasswordEncoder(10);
        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_WRONG);
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        User savedUser = userRepository.save(user);
        // Update Redis cache
        String cacheKey = "USER_" + savedUser.getEmail();
        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(savedUser));
        } catch (JsonProcessingException e) {
            log.error("Error updating Redis cache: {}", e.getMessage());
        }
    }

    // Get current user's information
    @Cacheable(value = "users", key = "#root.methodName + '_' + T(org.springframework.security.core.context.SecurityContextHolder).getContext().getAuthentication().getPrincipal().getClaim('id_user')")
    public UserResponse getMyInfor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AppException(ErrorCode.USER_NOT_AUTHENTICATED);
        }

        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = jwt.getClaim("id_user");
        log.info("Fetching current user from DB with ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_NOT_ACTIVE);
        }
        return userMapper.toUserResponse(user);
    }

    // Update username
    @CacheEvict(value = {"users", "usersPage", "usersList"}, allEntries = true)
    public UserResponse updateUsername(String id, String username) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_NOT_ACTIVE);
        }
        user.setUsername(username);
        User savedUser = userRepository.save(user);
        // Update Redis cache
        String cacheKey = "USER_" + savedUser.getEmail();
        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(savedUser));
        } catch (JsonProcessingException e) {
            log.error("Error updating Redis cache: {}", e.getMessage());
        }
        return userMapper.toUserResponse(savedUser);
    }

    // Get all users (non-paginated)
    @Cacheable(value = "usersList")
    public List<UserResponse> getUsers() {
        log.info("Fetching all users from DB...");
        return userRepository.findAll()
                .stream()
                .filter(User::isActive)
                .map(userMapper::toUserResponse)
                .toList();
    }
}