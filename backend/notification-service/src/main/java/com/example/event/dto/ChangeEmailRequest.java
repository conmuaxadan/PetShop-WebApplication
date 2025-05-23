package com.example.event.dto;

import jakarta.validation.constraints.Email;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeEmailRequest {
    String userId;
    @Email
    String email;
}
