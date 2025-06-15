package com.example.order_service.service;

import com.example.order_service.dto.response.RevenueResponse;
import com.example.order_service.dto.response.TopCustomerResponse;
import com.example.order_service.dto.response.TopProductResponse;
import com.example.order_service.repository.OrderItemRepository;
import com.example.order_service.repository.OrderRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class RevenueService {
    OrderRepository orderRepository;
    OrderItemRepository orderItemRepository;
    public List<RevenueResponse> getDailyRevenue() {
        List<Object[]> results = orderRepository.getDailyRevenue();
        return results.stream()
                .map(row -> new RevenueResponse(row[0].toString(), (Double) row[1]))
                .toList();
    }

    public List<RevenueResponse> getWeeklyRevenue() {
        List<Object[]> results = orderRepository.getWeeklyRevenue();
        return results.stream()
                .map(row -> new RevenueResponse(row[0].toString(), (Double) row[1]))
                .toList();
    }

    public List<RevenueResponse> getMonthlyRevenue() {
        List<Object[]> results = orderRepository.getMonthlyRevenue();
        return results.stream()
                .map(row -> new RevenueResponse(row[0].toString(), (Double) row[1]))
                .toList();
    }

    public List<RevenueResponse> getYearlyRevenue() {
        List<Object[]> results = orderRepository.getYearlyRevenue();
        return results.stream()
                .map(row -> new RevenueResponse(row[0].toString(), (Double) row[1]))
                .toList();
    }

    public Double getAverageMonthlyRevenue() {
        return orderRepository.getAverageMonthlyRevenue();
    }

    public List<TopProductResponse> getTopProductsByRevenue(String timeframe, int limit) {
        List<Object[]> results = orderItemRepository.findTopProductsByRevenue(timeframe);
        return results.stream()
                .limit(limit) // Apply limit
                .map(result -> {
                    TopProductResponse dto = new TopProductResponse();
                    dto.setId((Long) result[0]);
                    dto.setName((String) result[1]);
                    dto.setQuantity(((Number) result[2]).longValue());
                    dto.setRevenue(((Number) result[3]).doubleValue());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    public List<TopCustomerResponse> getTopCustomersByValue(String timeframe, int limit) {
        List<Object[]> results = orderItemRepository.findTopCustomersByValue(timeframe);
        return results.stream()
                .limit(limit)
                .map(row -> {
                    TopCustomerResponse dto = new TopCustomerResponse();
                    dto.setUserId((String) row[0]);
                    dto.setCustomerName((String) row[1]);
                    dto.setTotalOrders(((Number) row[2]).longValue());
                    dto.setTotalValue(((Number) row[3]).doubleValue());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}