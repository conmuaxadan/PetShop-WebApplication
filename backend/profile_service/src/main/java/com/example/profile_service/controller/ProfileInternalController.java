package com.example.profile_service.controller;

import com.example.event.dto.ChangeEmailRequest;
import com.example.event.dto.ChangePhoneRequest;
import com.example.profile_service.dto.request.CreationProfileRequest;
import com.example.profile_service.dto.response.ApiResponse;
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
@RequestMapping("/internal")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProfileInternalController {
    ProfileService profileService;
    @PostMapping()
    public ApiResponse<ProfileResponse> createProfile(@RequestBody CreationProfileRequest profile){
        return ApiResponse.<ProfileResponse>builder()
                .data(profileService.saveProfile(profile))
                .build();
    }
    // 🔹 Xử lý sự kiện thay đổi email từ Kafka
    @KafkaListener(topics = "change-email", groupId = "notification-group")
    public void changeEmail(ChangeEmailRequest request) {
        try {
            profileService.updateEmail(request.getUserId(), request.getEmail());
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật email cho userId {}: {}", request.getUserId(), e.getMessage(), e);
        }
    }

    // 🔹 Xử lý sự kiện thay đổi số điện thoại từ Kafka
    @KafkaListener(topics = "change-phone", groupId = "notification-group")
    public void changePhone(ChangePhoneRequest request) {
        profileService.updatePhone(request.getUserId(), request.getPhone());
    }
}
