package com.example.product_service.controller;

import com.example.product_service.dto.request.FilterRequest;
import com.example.product_service.dto.response.ApiResponse;
import com.example.product_service.dto.response.PageResponse;
import com.example.product_service.dto.response.ProductResponse;
import com.example.product_service.exception.AppException;
import com.example.product_service.exception.ErrorCode;
import com.example.product_service.service.ProductService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    ProductService productService;
    @GetMapping
    @CrossOrigin(origins = "http://localhost:3000,http://localhost:3001,null", allowCredentials = "true")
    public ApiResponse<PageResponse<ProductResponse>> getAllProducts(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ){
        return ApiResponse.<PageResponse<ProductResponse>>builder()
                .data(productService.getAllProductsForUser(page, size))
                .build();
    }
    // Get product by id
    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable Long id){
        ProductResponse product = productService.getProductByIdForUser(id);
        if(product == null) throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        return ApiResponse.<ProductResponse>builder()
                .data(product)
                .build();
    }
    // Get products by category id
    @GetMapping("/category/{categoryId}")
    public ApiResponse<PageResponse<ProductResponse>>
    getProductsByCategoryId(@PathVariable Long categoryId,
                            @RequestParam(required = false, defaultValue = "1") Integer page,
                            @RequestParam(required = false, defaultValue = "10") Integer size) {
        PageResponse<ProductResponse> products = productService.getProductsByCategoryForUser(categoryId,page,size);
        return ApiResponse.<PageResponse<ProductResponse>>builder()
                .data(products)
                .build();
    }
    @GetMapping("/search")
    public ApiResponse<PageResponse<ProductResponse>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size) {
        PageResponse<ProductResponse> products =
                productService.searchProductsByUser(keyword, page, size);
        return ApiResponse.<PageResponse<ProductResponse>>builder()
                .data(products)
                .build() ;
    }
    // Get products by filter
    @GetMapping("/filter")
    public ApiResponse<PageResponse<ProductResponse>> filterProducts(
            FilterRequest filter,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size) throws JsonProcessingException {
        PageResponse<ProductResponse> products =
                productService.getProductsByFilter(filter,page, size);
        return ApiResponse.<PageResponse<ProductResponse>>builder()
                .data(products)
                .build();
    }
}
