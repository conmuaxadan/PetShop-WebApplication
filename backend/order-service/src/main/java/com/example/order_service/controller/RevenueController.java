package com.example.order_service.controller;

import com.example.order_service.dto.response.ApiResponse;
import com.example.order_service.dto.response.RevenueResponse;
import com.example.order_service.dto.response.TopCustomerResponse;
import com.example.order_service.dto.response.TopProductResponse;
import com.example.order_service.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/revenue")
@RequiredArgsConstructor
public class RevenueController {
    private final RevenueService revenueService;

    @GetMapping("/daily")
    public ApiResponse<List<RevenueResponse>> getDailyRevenue() {
       return ApiResponse.<List<RevenueResponse>>builder()
               .data(revenueService.getDailyRevenue())
               .build();
    }
    @GetMapping("/weekly")
    public ApiResponse<List<RevenueResponse>> getWeeklyRevenue() {
        return ApiResponse.<List<RevenueResponse>>builder()
                .data(revenueService.getWeeklyRevenue())
                .build();
    }
    @GetMapping("/monthly")
    public ApiResponse<List<RevenueResponse>> getMonthlyRevenue() {
        return ApiResponse.<List<RevenueResponse>>builder()
               .data(revenueService.getMonthlyRevenue())
               .build();
    }
    @GetMapping("/yearly")
    public ApiResponse<List<RevenueResponse>> getYearlyRevenue() {
        return ApiResponse.<List<RevenueResponse>>builder()
               .data(revenueService.getYearlyRevenue())
               .build();
    }
    @GetMapping("/average-monthly")
    public ApiResponse<Double> getAvgRevenue() {
        return ApiResponse.<Double>builder()
                .data(revenueService.getAverageMonthlyRevenue())
                .build();
    }
    @GetMapping("/top-products")
    public ApiResponse<List<TopProductResponse>> getTopProductsByRevenue(
            @RequestParam(defaultValue = "all") String timeframe,
            @RequestParam(defaultValue = "5") int limit) {
        return ApiResponse.<List<TopProductResponse>>builder()
                .data(revenueService.getTopProductsByRevenue(timeframe,limit))
                .build();
    }
    @GetMapping("/top-customers")
    public ApiResponse<List<TopCustomerResponse>> getTopCustomersByRevenue(
    @RequestParam(defaultValue = "all") String timeframe,
    @RequestParam(defaultValue = "5") int limit) {
        return ApiResponse.<List<TopCustomerResponse>>builder()
                .data(revenueService.getTopCustomersByValue(timeframe,limit))
                .build();
    }

}

