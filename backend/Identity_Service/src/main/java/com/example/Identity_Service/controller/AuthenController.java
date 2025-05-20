package com.example.Identity_Service.controller;

import com.example.Identity_Service.dto.request.AuthenicationRequest;
import com.example.Identity_Service.dto.request.TokenRequest;
import com.example.Identity_Service.dto.request.UserCreationRequest;
import com.example.Identity_Service.dto.response.*;
import com.example.Identity_Service.service.AuthenicationService;
import com.example.event.dto.ChangeEmailRequest;
import com.example.event.dto.ResetPasswordRequest;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AuthenController {
     AuthenicationService authenService;

    private static final String RESET_PASSWORD_TOPIC = "reset-password-topic";

    @KafkaListener(topics = RESET_PASSWORD_TOPIC, groupId = "notification-group")
    public void resetPassword(ResetPasswordRequest request){
        log.info("Received ResetPasswordRequest: {}", request);
        authenService.resetPassword(request);
    }

    @PostMapping("/log-in")
    ApiResponse<AuthenicationResponse> authenticate(@RequestBody AuthenicationRequest requestBody){
        AuthenicationResponse result = authenService.authenticate(requestBody);
        return ApiResponse.<AuthenicationResponse>builder()
                .data(result)
                .build();
    }

    @PostMapping("/log-in-social")
    ApiResponse<AuthenicationResponse> loginSocial
            (@RequestBody UserCreationRequest request){
        AuthenicationResponse result = authenService.loginWithSocial(request);
        return ApiResponse.<AuthenicationResponse>builder()
               .data(result)
               .build();
    }

    @PostMapping("/introspect")
    ApiResponse<ValidTokenResponse> authenticate(@RequestBody TokenRequest requestBody) throws ParseException, JOSEException {
        ValidTokenResponse result = authenService.introspect(requestBody);
        return ApiResponse.<ValidTokenResponse>builder()
                .data(result)
                .build();

    }
    @PostMapping("/refresh")
    ApiResponse<TokenResponse> refresh(@RequestBody TokenRequest requestBody) throws ParseException, JOSEException {
        TokenResponse result = authenService.refreshToken(requestBody);
        return ApiResponse.<TokenResponse>builder()
                .data(result)
                .build();
    }
    @PostMapping("/log-out")
    ApiResponse<Void> logout(@RequestBody TokenRequest requestBody) throws ParseException, JOSEException {
        authenService.logout(requestBody);
        return ApiResponse.<Void>builder()
                .message("Logged out")
                .build();
    }
}
