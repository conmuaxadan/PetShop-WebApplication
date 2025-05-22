package com.example.profile_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileResponse {
    String id_user;
    String firstName;
    String lastName;
    AddressResponse address;
    String email;
    String phone;
    boolean isActive;
    Timestamp createAt;

}
