package com.example.order_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {
    private String id_address;
    private String province;
    private String district;
    private String ward;
    private String hamlet;
    private String postalCode;
}
