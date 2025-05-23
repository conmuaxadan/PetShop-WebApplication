package com.example.notification_service.dto.request;

import lombok.Data;

@Data
public class OtpVerificationRequest {
    private String phone;
    private String otp;
    private String email;
}

