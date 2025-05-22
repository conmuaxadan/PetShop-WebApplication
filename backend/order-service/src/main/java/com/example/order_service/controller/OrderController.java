package com.example.order_service.controller;

import com.example.order_service.dto.request.OrderRequest;
import com.example.order_service.dto.response.ApiResponse;
import com.example.order_service.dto.response.OrderResponse;
import com.example.order_service.dto.response.PageResponse;
import com.example.order_service.exception.AppException;
import com.example.order_service.exception.ErrorCode;
import com.example.order_service.service.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class OrderController {
    OrderService orderService;
    // Get all orders
    @GetMapping("")
    @PreAuthorize("hasAuthority('MANAGE_ORDER')")
    @CrossOrigin(origins = "http://localhost:3000,http://localhost:3001,null", allowCredentials = "true")
    public ApiResponse<PageResponse<OrderResponse>> getAllOrders(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size,
            @RequestParam(required = false , defaultValue = "")  String query
    ){
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .data(orderService.getAllOrders(page, size,query))
                .build();
    }
    // Get order by id
    @PreAuthorize("hasAuthority('MANAGE_ORDER')")
    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable String id){
        OrderResponse order = orderService.getOrderById(id);
        if(order == null) throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        return ApiResponse.<OrderResponse>builder()
               .data(order)
               .build();
    }
    // Get orders by customer id
    @PreAuthorize("hasAuthority('MANAGE_ORDER')")
    @GetMapping("/user/{userId}")
    public ApiResponse<PageResponse<OrderResponse>> getOrdersByUserId(
            @PathVariable String userId,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status
    ) {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .data(orderService.getOrdersByUserId(userId, page, size, status))
                .build();
    }
    // Get orders by customer id
    @GetMapping("/my-orders")
    public ApiResponse<PageResponse<OrderResponse>> getMyOrder(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status
    ) {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .data(orderService.getMyOrder(page, size, status))
                .build();
    }

    // Create order
    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_ORDER')")
    public ApiResponse<OrderResponse> createOrder(
                                                  @RequestBody OrderRequest orderRequest){
        OrderResponse order = orderService.createOrder(orderRequest);
        return ApiResponse.<OrderResponse>builder()
                .data(order)
                .code(201)
                .build();
    }

    // Delete order
    @PreAuthorize("hasAuthority('MANAGE_ORDER')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteOrder(@PathVariable String id){
        orderService.deleteOrder(id);
        return ApiResponse.<Void>builder()
               .build();
    }
    // Cancel order
    @PutMapping("/cancel/{id}")
    public ApiResponse<OrderResponse> cancelOrder(@PathVariable String id){
        OrderResponse order = orderService.updateStatusCancelOrder(id);
        if(order == null) throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        return ApiResponse.<OrderResponse>builder()
               .data(order)
               .build();
    }
    // update status
    @PutMapping("/{id}/update-status")
    public ApiResponse<OrderResponse> updateOrderStatus(@PathVariable String id,
                                                        @RequestParam String status){
        OrderResponse order = orderService.updateStatusOrder(id,status);
        return ApiResponse.<OrderResponse>builder()
               .data(order)
               .build();
    }

}
