package com.example.shipping_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
public class ShippingInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String label;
    private String area;
    private String orderId;
    private String fee;
    private String insuranceFee;
    private Long trackingId;
    private String estimatedPickTime;
    private String estimatedDeliverTime;
    private int statusId;
}
