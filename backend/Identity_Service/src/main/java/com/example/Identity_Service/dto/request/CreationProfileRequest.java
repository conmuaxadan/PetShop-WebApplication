package com.example.Identity_Service.dto.request;

import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreationProfileRequest {
    @Id
    String id_user;
    String firstName;
    String lastName;
//    String address;
    String email;
//    String phone;
}
