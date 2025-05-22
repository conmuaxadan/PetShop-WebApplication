package com.example.shipping_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderStatusResponse {
    private boolean success;
    private String message;
    private OrderDetail order;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderDetail {
        private String labelId;
        private String orderId;
        private int status;
        private String statusText;
        private String created;
        private String modified;
        private String pickDate;
        private String deliverDate;
        private String customerFullname;
        private String customerTel;
        private String address;
        private int storageDay;
        private double shipMoney;
        private double insurance;
        private double value;
        private double weight;
        private double pickMoney;
        private boolean isFreeShip;
    }
}
