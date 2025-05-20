package com.example.product_service.mapper;

import com.example.product_service.dto.request.CategoryRequest;
import com.example.product_service.dto.response.CategoryResponse;
import com.example.product_service.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toCategory(CategoryRequest category);
    CategoryResponse toCategoryResponse(Category category);
    Category updateCategory (long id, CategoryRequest category);
}
