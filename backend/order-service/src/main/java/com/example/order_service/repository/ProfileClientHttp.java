package com.example.order_service.repository;

import com.example.order_service.configuration.AuthenRequestInterceptor;
import com.example.order_service.dto.request.ProfileRequest;
import com.example.order_service.dto.response.ApiResponse;
import com.example.order_service.dto.response.ProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "profile-service", url = "http://localhost:8081",
        configuration = AuthenRequestInterceptor.class)
public interface ProfileClientHttp {
    @GetMapping("/profiles/{userId}")
    ApiResponse<ProfileResponse> getProfile(@PathVariable String userId);
}
