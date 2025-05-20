package com.example.Identity_Service.service;

import com.example.Identity_Service.constant.PredefinedRole;
import com.example.Identity_Service.dto.request.*;
import com.example.Identity_Service.dto.response.AuthenicationResponse;
import com.example.Identity_Service.dto.response.TokenResponse;
import com.example.Identity_Service.dto.response.UserResponse;
import com.example.Identity_Service.entity.UserLoginMethod;
import com.example.Identity_Service.mapper.ProfileClientMapper;
import com.example.Identity_Service.mapper.UserMapper;
import com.example.Identity_Service.repository.*;
import com.example.Identity_Service.dto.response.ValidTokenResponse;
import com.example.Identity_Service.entity.Role;
import com.example.Identity_Service.entity.User;
import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import com.example.Identity_Service.repository.UserRepository;
import com.example.event.dto.ResetPasswordRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AuthenicationService {

     UserRepository userRepository;
    UserMapper userMapper;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    RedisTemplate<String, Object> redisTemplate;
    UserLoginMethodRepository userLoginMethodRepository;
    ProfileClientMapper profileClientMapper;
    ProfileClientHttp profileClientHttp;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String signer_key;
    public AuthenicationResponse authenticate(AuthenicationRequest request) {
        ValueOperations<String, Object> valueOperations = redisTemplate.opsForValue();

//         Lấy user từ Redis trước
        ObjectMapper objectMapper = new ObjectMapper();
        String userJson = (String) valueOperations.get("USER_" + request.getEmail());
        User user = null;
        try {
            user = objectMapper.readValue(userJson, User.class);
            log.info("User: " + user.toString());
        } catch (Exception e) {
            //         Nếu không có trong Redis, lấy từ DB
            log.info(userRepository.findByEmail(request.getEmail()).toString());
            user= userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        }

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) {
            throw new AppException(ErrorCode.USER_INVALID_CREDENTIALS);
        }

        String token = generateToken(user);

        return AuthenicationResponse.builder()
                .token(token)
                .authenticated(authenticated)
                .build();
    }
    public void resetPassword(ResetPasswordRequest request){
        Optional<User> userOp = userRepository.findByEmail(request.getEmail());
        if(userOp.isPresent()){
            User user = userOp.get();
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);
            return;
        }
        throw new AppException(ErrorCode.USER_NOT_FOUND);
    }

    public AuthenicationResponse loginWithSocial(UserCreationRequest request) {
        Optional<User> user = userRepository.findByEmail(request.getEmail());
        User newUser =null;
        if (user.isPresent()) {
            // Kiểm tra user đã từng đăng nhập bằng Google/Facebook chưa
            boolean hasLoginMethod = userLoginMethodRepository.existsByUserAndLoginType(user.get(), request.getLoginType());

            if (!hasLoginMethod) {
                // Thêm phương thức đăng nhập mới nếu user chưa từng dùng Google/Facebook
                UserLoginMethod loginMethod = UserLoginMethod.builder()
                        .user(user.get())
                        .loginType(request.getLoginType())
                        .build();
                userLoginMethodRepository.save(loginMethod);
                // them profile neu moi tao lan dau
                CreationProfileRequest profileRq = profileClientMapper.toCreateProfileRequest(request);
                profileRq.setId_user(user.get().getId_user());
                profileClientHttp.createProfile(profileRq);
            }
            newUser = user.get();


        } else {
            // Nếu user chưa tồn tại, tạo mới tài khoản
            HashSet<Role> roles = new HashSet<>();
            roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);
             newUser = User.builder()
                    .email(request.getEmail())
                    .username(request.getUsername())
                    .password("")
                     .isActive(true)
                    .avatar(request.getAvatar())
                    .roles(roles)
                    .build();
            userRepository.save(newUser);

            UserLoginMethod loginMethod = UserLoginMethod.builder()
                    .user(newUser)
                    .loginType(request.getLoginType())
                    .build();
            userLoginMethodRepository.save(loginMethod);
            // them profile neu moi tao lan dau
            CreationProfileRequest profileRq = profileClientMapper.toCreateProfileRequest(request);
            profileRq.setId_user(newUser.getId_user());
            profileClientHttp.createProfile(profileRq);

        }



        return AuthenicationResponse.builder()
                .authenticated(true)
                .token(generateToken(newUser))
                .build();
    }


    public ValidTokenResponse introspect(TokenRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        boolean isValid  = false;
        try {
            verifyToken(token);
            isValid = true;
        }catch (Exception exception){
            log.error("Invalid token");
        }
        return ValidTokenResponse.builder()
                .valid(isValid)
                .build();
    }

    private SignedJWT verifyToken(String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(signer_key.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        boolean isValid = signedJWT.verify(verifier);
        Date expiredDate = signedJWT.getJWTClaimsSet().getExpirationTime();
        String jwtID = signedJWT.getJWTClaimsSet().getJWTID();
        String username = signedJWT.getJWTClaimsSet().getSubject();
        if (expiredDate != null && expiredDate.before(new Date())) {
            throw new AppException(ErrorCode.TOKEN_EXPIRED);
        }
        // Kiểm tra nếu token đã bị blacklist
        if (Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + jwtID))) {
            throw new AppException(ErrorCode.TOKEN_DELETED);
        }

        return signedJWT;
    }


    public void logout(TokenRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        SignedJWT signedJWT = verifyToken(token);
        String jwtID = signedJWT.getJWTClaimsSet().getJWTID();
        String username = signedJWT.getJWTClaimsSet().getSubject();

        // Thêm token vào danh sách blacklist để ngăn chặn reuse
        redisTemplate.opsForValue().set("blacklist:" + jwtID, "blacklisted", 1, TimeUnit.DAYS);

    }

    public TokenResponse refreshToken(TokenRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        SignedJWT signedJWT = verifyToken(token);
        String jwtID = signedJWT.getJWTClaimsSet().getJWTID();
        String subject = signedJWT.getJWTClaimsSet().getSubject();

        // Kiểm tra nếu token đã bị blacklist trong Redis
        if (Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + jwtID))) {
            throw new AppException(ErrorCode.INVALID_KEY);
        }

        // Nếu không bị blacklist, cấp token mới
        User user = userRepository.findByUsername(subject)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String tokenReturn = generateToken(user);
        redisTemplate.opsForValue().set("blacklist:" + jwtID, "blacklisted", 1, TimeUnit.DAYS);
        return TokenResponse.builder()
                .token(tokenReturn)
                .build();
    }

    private String generateToken(User user) {
        UserResponse response = userMapper.toUserResponse(user);
        // header jwt
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(response.getUsername())
                .expirationTime(Date.from(Instant.now().plus(1, ChronoUnit.DAYS)))
                .issueTime(new Date())
                .claim("email", response.getEmail())
                .issuer("admin")
                .claim("id_user", response.getId_user())
                .claim("picture", response.getAvatar())
                .jwtID(UUID.randomUUID().toString())
               .claim("scope", getScopeClaim(user.getRoles()))
                .build();
        // payload jwt
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader,payload);

        // sign jwt
        try {
            jwsObject.sign(new MACSigner(signer_key.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);

        }
    }

    private String getScopeClaim(Set<Role> roles){
        StringJoiner stringJoiner = new StringJoiner(" ");
        if(roles==null)
            return stringJoiner.toString();
        if (!roles.isEmpty()){
            for(Role role : roles){
                if (role.isActive()) {
                    log.info("ROLE_" + role.getName());
                    stringJoiner.add("ROLE_" + role.getName());
                    if (!role.getPermissions().isEmpty()) {
                        stringJoiner.add(role.getPermissions().stream()
                                .map(p -> p.getName())
                                .collect(Collectors.joining(" ")));
                    }
                } else {
                    log.info("Skipping inactive role: " + role.getName());
                }
            }
        }
        return stringJoiner.toString();
    }
}
