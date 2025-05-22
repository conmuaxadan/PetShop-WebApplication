package com.example.shipping_service.controller;

import com.example.shipping_service.dto.request.ShippingFeeRequest;
import com.example.shipping_service.dto.request.ShippingRequest;
import com.example.shipping_service.dto.response.*;
import com.example.shipping_service.service.ShippingService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ShippingController {
    private final ShippingService shippingService;

    @PostMapping("/cancel/{idOrder}")
    public CancelShippingResponse cancelOrder(@PathVariable String idOrder) {
        return shippingService.cancelShipping(idOrder);
    }
    @GetMapping("/order-status/{idOrder}")
    public ApiResponse<OrderStatusResponse> getOrderStatus(@PathVariable String idOrder) {
        OrderStatusResponse response = shippingService.checkOrderStatus(idOrder);
        return ApiResponse.<OrderStatusResponse>builder()
                .data(response)
                .build();
    }
    @PostMapping("/create-order")
    public ApiResponse<ShippingResponse> createOrder(@RequestBody ShippingRequest request) {
        return ApiResponse.<ShippingResponse>builder()
               .data(shippingService.createShipping(request))
               .build();
    }
    @PostMapping("/fee")
    public ApiResponse<ShippingFeeResponse> getShippingFee(@RequestBody ShippingFeeRequest request) {
        ShippingFeeResponse fee = shippingService.getShippingFee(request);
        log.info(fee.toString());
        return ApiResponse.<ShippingFeeResponse>builder()
               .data(fee)
               .build();
    }

}
