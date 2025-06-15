package com.example.order_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemResponse {
    String id_order_item;
    String name;
    long productCode;
    int quantity;
    double price;
    double weight;
    String image;
}
