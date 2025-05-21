package com.example.profile_service.controller;

import com.example.profile_service.dto.request.AdminUpdationProfileRequest;
import com.example.profile_service.dto.request.CreationProfileRequest;
import com.example.profile_service.dto.response.ApiResponse;
import com.example.profile_service.dto.response.PageResponse;
import com.example.profile_service.dto.response.ProfileResponse;
import com.example.profile_service.service.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/admin")
@PreAuthorize("hasAuthority('MANAGE_PROFILE')")
public class AdminProfileController {
    // Lấy tất cả hồ sơ với phân trang
    ProfileService profileService;

    @GetMapping("")
//    @CrossOrigin(origins = "http://localhost:3000,http://localhost:3001,null", allowCredentials = "true")
    public ApiResponse<PageResponse<ProfileResponse>> getAllProfiles(
            @RequestParam(required = false, defaultValue = "") String keyword ,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ) {
        return ApiResponse.<PageResponse<ProfileResponse>>builder()
                .data(profileService.getAllProfiles(keyword, page, size))
                .build();
    }
    @PutMapping("/{id}")
    public ApiResponse<Void> updateProfileByAdmin(@PathVariable String id, @RequestBody AdminUpdationProfileRequest request) {
        profileService.updateProfile(id, request);
        return ApiResponse.<Void>builder().build();
    }
    @PatchMapping("/delete/{id}")
    public ApiResponse<Void> deleteProfile(@PathVariable String id) {
        profileService.deleteProfile(id);
        return ApiResponse.<Void>builder().build();
    }

    @PatchMapping("/restore/{id}")
    public ApiResponse<Void> restoreProfile(@PathVariable String id) {
        profileService.restoreProfile(id);
        return ApiResponse.<Void>builder()
                .message("Profile restored")
                .build();
    }
    //  Lấy hồ sơ theo ID
    @GetMapping("/{id}")
    public ApiResponse<ProfileResponse> getProfile(@PathVariable String id) {
        return ApiResponse.<ProfileResponse>builder()
                .data(profileService.getProfileById(id))
                .build();
    }
    @PostMapping
    public ApiResponse<ProfileResponse> getProfile(@RequestBody CreationProfileRequest request) {
        return ApiResponse.<ProfileResponse>builder()
                .data(profileService.saveProfile(request))
                .build();
    }

}
