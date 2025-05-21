package com.example.product_service.service;

import com.example.product_service.dto.request.CategoryRequest;
import com.example.product_service.dto.response.CategoryResponse;
import com.example.product_service.dto.response.PageResponse;
import com.example.product_service.dto.response.ProductResponse;
import com.example.product_service.entity.Category;
import com.example.product_service.entity.Product;
import com.example.product_service.mapper.CategoryMapper;
import com.example.product_service.repository.CategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;


    // Method to fetch a category by id
    public CategoryResponse getCategoryById(Long categoryId) {
        return categoryMapper.toCategoryResponse(categoryRepository.findById(categoryId).orElse(null));
    }
    // Method to add a new category
    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        log.info(categoryRequest.toString());
        Category category = categoryRepository.save(categoryMapper.toCategory(categoryRequest));
        return categoryMapper.toCategoryResponse(category);
    }
    // Method to update a category
    public CategoryResponse updateCategory(Long categoryId, CategoryRequest categoryRequest) {
        Category category = categoryMapper.updateCategory(categoryId, categoryRequest);
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }
    // Method to delete a category
    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }
    public PageResponse<CategoryResponse> searchCategories(String keyword, int page, int size){
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Category> categoryPage = categoryRepository.searchCategories(keyword, pageable);

        List<CategoryResponse> categoryResponses = categoryPage.getContent()
                .stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();

        return PageResponse.<CategoryResponse>builder()
                .currentPage(page)
                .totalPages(categoryPage.getTotalPages())
                .totalElements(categoryPage.getTotalElements())
                .elements(categoryResponses)
                .build();
    }
    public PageResponse<CategoryResponse> getAllCategories(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Category> categoryPage = categoryRepository.findAll(pageable);

        List<CategoryResponse> categoryResponses = categoryPage.getContent()
                .stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();

        return PageResponse.<CategoryResponse>builder()
                .currentPage(page)
                .totalPages(categoryPage.getTotalPages())
                .totalElements(categoryPage.getTotalElements())
                .elements(categoryResponses)
                .build();
    }
}
