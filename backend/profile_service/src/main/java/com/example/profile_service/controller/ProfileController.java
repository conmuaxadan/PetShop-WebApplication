package com.example.profile_service.controller;

import com.example.event.dto.ChangeEmailRequest;
import com.example.event.dto.ChangePhoneRequest;
import com.example.profile_service.dto.request.AddressRequest;
import com.example.profile_service.dto.request.AdminUpdationProfileRequest;
import com.example.profile_service.dto.request.CreationProfileRequest;
import com.example.profile_service.dto.request.UpdationProfileRequest;
import com.example.profile_service.dto.response.ApiResponse;
import com.example.profile_service.dto.response.PageResponse;
import com.example.profile_service.dto.response.ProfileResponse;
import com.example.profile_service.service.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileController {
    ProfileService profileService;

    //  Tạo hồ sơ (create profile)
    @PostMapping("address/{idUser}")
    public ApiResponse<Void> createProfile(@RequestBody AddressRequest addressRequest, @PathVariable String idUser) {
        log.debug("Received AddressRequest: {}", addressRequest);
        log.debug("User ID: {}", idUser);

        profileService.saveAddress(addressRequest, idUser);

        return ApiResponse.<Void>builder()
                .message("Cập nhật thông tin địa chỉ thành công")
                .build();
    }


    // Cập nhật hồ sơ (update profile)
    @PutMapping("/{id}")
    public ApiResponse<Void> updateProfile(@PathVariable String id, @RequestBody UpdationProfileRequest request) {
        log.debug("Received UpdationProfileRequest: {}", request);
        profileService.updateProfile(id, request);
        return ApiResponse.<Void>builder().build();
    }


    // Lấy thông tin hồ sơ của người dùng hiện tại
    @GetMapping("/my-profile")
    public ApiResponse<ProfileResponse> getMyProfile() {
        return ApiResponse.<ProfileResponse>builder()
                .data(profileService.getMyProfile())
                .build();
    }



    // Xóa hồ sơ (delete profile)

}
