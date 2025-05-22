package com.example.profile_service.dto.request;

import com.example.profile_service.entity.Address;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUpdationProfileRequest {
    String firstName;
    String lastName;
    AddressRequest address;
    String email;
    String phone;
}
