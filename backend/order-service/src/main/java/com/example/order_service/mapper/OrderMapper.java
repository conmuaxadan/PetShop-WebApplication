package com.example.order_service.mapper;

import com.example.order_service.dto.request.OrderRequest;
import com.example.order_service.dto.response.OrderResponse;
import com.example.order_service.entity.Order;
import com.example.order_service.entity.OrderItem;
import com.example.order_service.enums.OrderStatus;
import org.mapstruct.*;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {

    @Mapping(target = "id_order", source = "id")
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "customerName", source = "name")
    Order toOrder(OrderRequest request);

    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "id", source = "id_order")
    @Mapping(target = "name", source = "customerName")
    OrderRequest toOrderRequest(Order order);

    @Mapping(target = "id", source = "id_order")
    @Mapping(target = "orderDate", source = "order_date")
    @Mapping(target = "status", source = "status", qualifiedByName = "mapStatus")
    @Mapping(target = "totalPrice",source = "value")
    OrderResponse toOrderResponse(Order order);
    @Named("mapStatus")
    default OrderStatus mapStatus(int status) {
        return OrderStatus.fromCode(status);
    }


}
