package com.example.order_service.repository;

import com.example.order_service.configuration.AuthenRequestInterceptor;
import com.example.order_service.dto.request.OrderItemRequest;
import com.example.order_service.dto.request.ShippingRequest;
import com.example.order_service.dto.response.ApiResponse;
import com.example.order_service.dto.response.CancelShippingResponse;
import com.example.order_service.dto.response.OrderStatusResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "shipping-service", url = "http://localhost:8087/shipping"
,configuration = AuthenRequestInterceptor.class)
public interface ShippingClientHttp {
    @PostMapping (value = "/cancel/{idOrder}",produces = MediaType.APPLICATION_JSON_VALUE)
    CancelShippingResponse cancelShipping(@PathVariable String idOrder);

    @PostMapping (value = "/create-order",produces = MediaType.APPLICATION_JSON_VALUE)
    Object createShippingOrder(@RequestBody ShippingRequest request);

    @GetMapping(value = "/order-status/{idOrder}",produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<OrderStatusResponse> getShippingStatus(@PathVariable String idOrder);
}
