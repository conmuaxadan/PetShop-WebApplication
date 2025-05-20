package com.example.Identity_Service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Data
public class ChangePasswordRequest {
    String oldPassword;
    String newPassword;
    String confirmPassword;
}
