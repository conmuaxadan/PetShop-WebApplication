package com.example.product_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WeightTypeRequest {
//    private Long id_weight_type;
    private double weight;
//    private String unit;
    int stock;

}
