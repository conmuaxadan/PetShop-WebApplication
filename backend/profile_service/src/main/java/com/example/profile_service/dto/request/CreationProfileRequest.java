package com.example.profile_service.dto.request;

import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreationProfileRequest {
    @Id
    String id_user;
    String firstName;
    String lastName;
    AddressRequest address;
    String email;
    String phone;
    boolean active =true;
}
