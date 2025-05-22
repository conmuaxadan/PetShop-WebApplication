package com.example.order_service.dto.response;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
}
