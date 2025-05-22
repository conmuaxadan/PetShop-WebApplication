package com.example.shipping_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ShippingResponse {
    private boolean success;
    private String message;
    private OrderData order;
    private String warningMessage;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderData {
        private String partnerId;
        private String label;
        private int area;
        private int fee;
        private int insuranceFee;
        private String estimatedPickTime;
        private String estimatedDeliverTime;
        private int statusId;
        private long trackingId;
        private String sortingCode;
        private String dateToDelayPick;
        private int pickWorkShift;
        private String dateToDelayDeliver;
        private int deliverWorkShift;
        private int pkgDraftId;
        private int isXfast;
    }
}