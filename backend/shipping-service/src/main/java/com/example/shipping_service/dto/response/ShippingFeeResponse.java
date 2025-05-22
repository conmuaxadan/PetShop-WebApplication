package com.example.shipping_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ShippingFeeResponse {
    private boolean success;
    private String message;
    private FeeDetails fee;

    @Data
    public static class FeeDetails {
        private String name;
        private int fee;
        private int insuranceFee;
        private int includeVat;
        private int costId;
        private String deliveryType;
        private int a;
        private String dt;
        private List<ExtraFee> extFees;
        private String promotionKey;
        private boolean delivery;
        private int shipFeeOnly;
        private double distance;
        private FeeOptions options;
    }

    @Builder
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExtraFee {
        private String display;
        private String title;
        private int amount;
        private String type;
    }

    @Data
    public static class FeeOptions {
        private String name;
        private String title;
        private int shipMoney;
        private String shipMoneyText;
        private String vatText;
        private String desc;
        private String coupon;
        private int maxUses;
        private int maxDates;
        private String maxDateString;
        private String content;
        private String activatedDate;
        private String couponTitle;
        private String discount;
        private int couponId;
    }
}
