package com.example.notification_service.controller;

import com.example.notification_service.dto.request.OtpRequest;
import com.example.notification_service.dto.request.OtpVerificationRequest;
import com.example.notification_service.dto.request.SendResetPasswordRequest;
import com.example.notification_service.dto.response.ApiResponse;
import com.example.notification_service.service.OtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class OtpController {
    OtpService otpService;

    @PostMapping("/send-confirm-phone-otp")
    public ApiResponse<Void> sendConfirmPhoneOtp(@RequestBody OtpRequest request) {
        try {
            otpService.sendPhoneOtp(request);
            return ApiResponse.<Void>builder()
                    .message("Mã OTP đã được gửi thành công")
                    .code(1000)  // Thành công
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Void>builder()
                    .message("Gửi mã OTP thất bại: " + e.getMessage())
                    .code(5000)  // Lỗi server
                    .build();
        }
    }

    @PostMapping("/verify-confirm-phone-otp/{userId}")
    public ApiResponse<String> verifyConfirmPhoneOtp(@PathVariable String userId, @RequestBody OtpVerificationRequest request) {
        try {
            String result = otpService.verifyPhoneOtp(request, userId);
            return ApiResponse.<String>builder()
                    .data(result)
                    .code(1000)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<String>builder()
                    .message("Xác thực OTP thất bại: " + e.getMessage())
                    .code(5001)
                    .build();
        }
    }

    @PostMapping("/send-confirm-email-otp")
    public ApiResponse<Void> sendConfirmEmailOtp(@RequestBody OtpRequest email) {
        try {
            otpService.sendOtpMail(email);
            return ApiResponse.<Void>builder()
                    .message("Mã OTP qua email đã được gửi thành công")
                    .code(1000)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Void>builder()
                    .message("Gửi OTP qua email thất bại: " + e.getMessage())
                    .code(5002)
                    .build();
        }
    }

    @PostMapping("/send-forgot-password-email-otp")
    public ApiResponse<Void> sendForgotPasswordEmailOtp(@RequestBody OtpRequest email) {
        try {
            otpService.sendForgotPasswordMail(email);
            return ApiResponse.<Void>builder()
                    .message("Mã OTP đặt lại mật khẩu đã được gửi thành công")
                    .code(1000)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Void>builder()
                    .message("Gửi OTP quên mật khẩu thất bại: " + e.getMessage())
                    .code(5004)
                    .build();
        }
    }

    @PostMapping("/verify-confirm-email-otp/{userId}")
    public ApiResponse<String> verifyConfirmEmailOtp(@PathVariable String userId, @RequestBody OtpVerificationRequest request) {
        try {
            String isVerified = otpService.verifyEmailOtp(request, userId);
            return ApiResponse.<String>builder()
                    .data(isVerified)
                    .code(1000)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<String>builder()
                    .message("Xác thực OTP qua email thất bại: " + e.getMessage())
                    .code(5003)
                    .build();
        }
    }
    @PostMapping("/update-password")
    public ApiResponse<String> updatePassword(@RequestBody SendResetPasswordRequest request) {
        try {
            String result = otpService.updatePassword(request);
            return ApiResponse.<String>builder()
                    .data(result)

                    .code(1000)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<String>builder()
                    .message("Cập nhật mật khẩu thất bại: " + e.getMessage())
                    .code(5006)
                    .build();
        }
    }
    @PostMapping("/verify-forgot-password-email-otp")
    public ApiResponse<String> verifyForgotPasswordEmailOtp(@RequestBody OtpVerificationRequest request) {
        try {
            String isVerified = otpService.verifyForgotPasswordOtp(request);
            return ApiResponse.<String>builder()
                    .data(isVerified)
                    .code(1000)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<String>builder()
                    .message("Xác thực OTP thất bại: " + e.getMessage())
                    .code(5005)
                    .build();
        }

    }
}
