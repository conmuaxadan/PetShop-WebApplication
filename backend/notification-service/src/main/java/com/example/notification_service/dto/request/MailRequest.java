package com.example.notification_service.dto.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MailRequest {
    Sender sender;
    List<Recipient> to;
    String subject;
    String textContent;
}
