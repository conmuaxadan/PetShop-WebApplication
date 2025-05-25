package com.example.review_service.repository;

import com.example.review_service.dto.response.ApiResponse;
import com.example.review_service.dto.response.ReviewerResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "identity-service", url = "http://localhost:8080/identity/users/reviewer")
public interface ProfileClientHttp {
    @GetMapping(value = "/{id_user}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<ReviewerResponse> getProfile(@PathVariable String id_user);
}
