package com.example.product_service.controller;

import com.example.product_service.dto.request.CategoryRequest;
import com.example.product_service.dto.response.ApiResponse;
import com.example.product_service.dto.response.CategoryResponse;
import com.example.product_service.dto.response.PageResponse;
import com.example.product_service.exception.AppException;
import com.example.product_service.exception.ErrorCode;
import com.example.product_service.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {
    CategoryService categoryService;
    // Get all categories
    @GetMapping
    public ApiResponse<PageResponse<CategoryResponse>> getAllCategories(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ) {
        return ApiResponse.<PageResponse<CategoryResponse>>builder()
                .data(categoryService.getAllCategories(page,size))
                .build();
    }
    // search
    @GetMapping("/search")
    public ApiResponse<PageResponse<CategoryResponse>> searchCategories(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size){
        return ApiResponse.<PageResponse<CategoryResponse>>builder()
                .data(categoryService.searchCategories(keyword, page, size))
               .build();
    }
    // Delete a category
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.<Void>builder()
               .build();
    }
    // Get category by id
    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getCategoryById(@PathVariable Long id) {
        return ApiResponse.<CategoryResponse>builder()
                .data(categoryService.getCategoryById(id))
                .build();
    }
    // Post a new category
    @PostMapping
    public ApiResponse<CategoryResponse> createCategory(@RequestBody CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
               .data(categoryService.createCategory(request))
               .build();
    }
    // Update a category
    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> updateCategory(@PathVariable Long id, CategoryRequest request) {
        CategoryResponse category = categoryService.updateCategory(id, request);
        if (category == null) throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        return ApiResponse.<CategoryResponse>builder()
               .data(category)
               .build();
    }

}
