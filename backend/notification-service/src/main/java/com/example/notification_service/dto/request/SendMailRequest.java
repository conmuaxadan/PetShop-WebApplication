package com.example.notification_service.dto.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendMailRequest {
    Recipient to;
    String subject;
    String textContent;
}
