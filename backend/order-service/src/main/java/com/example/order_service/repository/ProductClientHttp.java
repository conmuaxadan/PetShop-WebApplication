package com.example.order_service.repository;

import com.example.order_service.configuration.AuthenRequestInterceptor;
import com.example.order_service.dto.request.OrderItemRequest;
import com.example.order_service.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "product-service", url = "http://localhost:8082/products"
,configuration = AuthenRequestInterceptor.class)
public interface ProductClientHttp {
    @PostMapping (value = "/stock/check",produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<List<String>> isStock(@RequestBody List<OrderItemRequest> request);
}
