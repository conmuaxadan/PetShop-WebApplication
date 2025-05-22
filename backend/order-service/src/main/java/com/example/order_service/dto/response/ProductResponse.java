package com.example.order_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    long id_product;
    String name;
    Double price;
    String description;
    String image;
}
