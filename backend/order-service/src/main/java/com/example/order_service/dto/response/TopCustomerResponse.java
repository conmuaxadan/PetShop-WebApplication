package com.example.order_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TopCustomerResponse {
    private String userId;
    private String customerName;
    private long totalOrders;
    private double totalValue;
}
