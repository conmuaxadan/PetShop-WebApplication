package com.example.event.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationRequest {
    String nameReceptor;
    String emailReceptor;
    String subject;
    String textContent;
}
