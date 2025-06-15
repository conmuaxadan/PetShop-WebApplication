package com.example.payment_service.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "payment_info")  // Specify the collection name
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Payment {
    private String orderId;
    private double amount;
    private String paymentMethod;
    private String paymentStatus;

}
