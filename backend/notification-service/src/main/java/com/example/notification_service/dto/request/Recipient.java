package com.example.notification_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@AllArgsConstructor
@Data
public class Recipient {
    private String email;
    private String name;
}