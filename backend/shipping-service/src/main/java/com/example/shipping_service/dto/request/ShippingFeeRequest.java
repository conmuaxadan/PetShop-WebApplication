package com.example.shipping_service.dto.request;


import com.example.shipping_service.configuration.OrderConfig;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ShippingFeeRequest {
    private String pick_address;
    private String pick_province;
    private String pick_district;
    private String pick_ward;

    private String address;
    private String province;
    private String district;
    private String ward;

    private String value;
    private double weight;
    private String deliver_option ;
    private List<Integer> tags;

    public void fromConfig(OrderConfig config) {
        this.pick_address = config.getPickAddress();
        this.pick_province = config.getPickProvince();
        this.pick_district = config.getPickDistrict();
        this.pick_ward = config.getPickWard();
        this.tags = config.getTags();
        this.deliver_option = config.getDeliverOption();
    }
}
