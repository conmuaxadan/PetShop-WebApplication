package com.example.profile_service.configuration;

import com.example.profile_service.exception.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;

import java.io.IOException;

public class AuthenticationEntryPoint implements org.springframework.security.web.AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        ErrorCode errorCode = ErrorCode.USER_NOT_AUTHENTICATED;
                response.setStatus(errorCode.getStatusCode().value());
                response.setContentType(String.valueOf(MediaType.APPLICATION_JSON));
                response.getWriter().write(
                        "{\"code\":\"" + errorCode.getCode() + "\",\"message\":\"" + errorCode.getMessage() + "\"}"
                );
                response.flushBuffer();
    }
}
