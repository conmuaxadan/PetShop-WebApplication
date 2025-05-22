package com.example.shipping_service.mapper;

import com.example.shipping_service.dto.request.ShippingRequest;
import com.example.shipping_service.dto.response.ShippingResponse;
import com.example.shipping_service.entity.ShippingInfo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ShippingMapper {
    @Mapping(source = "partnerId", target = "orderId")
    ShippingInfo toEntity(ShippingResponse.OrderData orderData);
}
