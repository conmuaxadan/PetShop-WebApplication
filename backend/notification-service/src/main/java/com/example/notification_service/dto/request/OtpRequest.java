package com.example.notification_service.dto.request;

import lombok.Data;

@Data
public class OtpRequest {
    private String phone;
    private String email;
}

