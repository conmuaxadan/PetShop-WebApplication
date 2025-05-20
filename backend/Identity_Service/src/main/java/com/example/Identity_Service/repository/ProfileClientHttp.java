package com.example.Identity_Service.repository;

import com.example.Identity_Service.configuration.AuthenRequestInterceptor;
import com.example.Identity_Service.dto.request.CreationProfileRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "profile-service", url = "http://localhost:8081/profiles/internal"
,configuration = AuthenRequestInterceptor.class)
public interface ProfileClientHttp {
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    Object createProfile(@RequestBody CreationProfileRequest profile);
}
