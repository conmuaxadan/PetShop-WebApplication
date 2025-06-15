package com.example.order_service.dto.request;

import com.example.order_service.dto.response.AddressResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileRequest {
    String id_user;
    String firstName;
    String lastName;
    AddressRequest address;
    String email;
    String phone;
}
