package com.example.payment_service.controller;

import com.example.payment_service.dto.response.ApiResponse;
import com.example.payment_service.dto.response.VNPayResponse;
import com.example.payment_service.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/vnpay")
public class VNPayController {
    private final PaymentService paymentService;
    @Value("${Frontend_Payment_Return}")
    private String frontendPaymentReturn;

    @GetMapping("/pay")
    public ApiResponse<VNPayResponse> pay(HttpServletRequest request) {
        return  ApiResponse.<VNPayResponse>
                builder()
                .code(201)
                .message("Payment success")
                .data(paymentService.createVnPayPayment(request))
                .build();

    }
    @GetMapping("/pay-callback")
    public void payCallbackHandler(HttpServletRequest request, HttpServletResponse response) throws IOException, IOException {
        String status = request.getParameter("vnp_ResponseCode");

        if ("00".equals(status)) {
            response.sendRedirect(frontendPaymentReturn+"?status=success");
        } else {
            response.sendRedirect(frontendPaymentReturn+"?status=failed");
        }
    }

}

