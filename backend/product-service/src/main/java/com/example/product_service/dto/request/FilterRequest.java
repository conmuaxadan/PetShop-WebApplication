package com.example.product_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FilterRequest {
    private Boolean organic;
    private Double minPrice;
    private Double maxPrice;
    private Long categoryId;
    private String brand;
    private String origin;
    private String query;
}
