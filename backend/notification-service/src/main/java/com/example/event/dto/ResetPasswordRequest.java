package com.example.event.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResetPasswordRequest {
     String email;
     String password;
}
