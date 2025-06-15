package com.example.order_service.mapper;

import com.example.order_service.dto.request.OrderItemRequest;
import com.example.order_service.dto.response.OrderItemResponse;
import com.example.order_service.entity.OrderItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    OrderItemRequest toOrderItemRequest(OrderItem orderItem);
    OrderItem toOrderItem(OrderItemRequest request);
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);
}
