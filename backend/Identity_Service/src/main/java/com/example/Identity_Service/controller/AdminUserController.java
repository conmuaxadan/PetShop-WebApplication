package com.example.Identity_Service.controller;

import com.example.Identity_Service.dto.request.UserCreationRequest;
import com.example.Identity_Service.dto.request.UserUpdateRequest;
import com.example.Identity_Service.dto.response.ApiResponse;
import com.example.Identity_Service.dto.response.PageResponse;
import com.example.Identity_Service.dto.response.UserResponse;
import com.example.Identity_Service.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('MODERATOR')")
public class AdminUserController {
    UserService userService;

    // Get all users with pagination and keyword search
    @GetMapping
    public ApiResponse<PageResponse<UserResponse>> getAllUsers(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("username: {}", authentication.getName());
        log.info("authority: {}", authentication.getAuthorities());
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .data(userService.getAllUsers(keyword, page, size))
                .build();
    }

    // Update user by ID
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ApiResponse<Void> updateUserByAdmin(
            @PathVariable String id,
            @Valid @RequestPart("user") UserUpdateRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) throws JsonProcessingException {
        userService.updateUser(id, request, file);
        return ApiResponse.<Void>builder().build();
    }

    // Delete user by ID
    @PatchMapping("/delete/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ApiResponse.<Void>builder().build();
    }

    // Restore deleted user by ID
    @PatchMapping("/restore/{id}")
    public ApiResponse<Void> restoreUser(@PathVariable String id) {
        userService.restoreUser(id);
        return ApiResponse.<Void>builder()
                .message("User restored")
                .build();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUser(@PathVariable String id) {
        return ApiResponse.<UserResponse>builder()
                .data(userService.getUserById(id))
                .build();
    }

    // Create a new user
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<UserResponse> createUser(
            @Valid @RequestPart("user") UserCreationRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) throws JsonProcessingException {
        return ApiResponse.<UserResponse>builder()
                .data(userService.createUser(request, file))
                .build();
    }
}