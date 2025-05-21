package com.example.product_service.mapper;

import com.example.product_service.dto.request.ProductRequest;
import com.example.product_service.dto.response.CategoryResponse;
import com.example.product_service.dto.response.ProductResponse;
import com.example.product_service.dto.response.WeightProductResponse;
import com.example.product_service.dto.response.WeightTypeResponse;
import com.example.product_service.entity.Product;
import com.example.product_service.entity.WeightProduct;
import com.example.product_service.entity.WeightType;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "category", source = "category")
    @Mapping(target = "isActive", source = "active")
    @Mapping(target = "weightProducts", expression = "java(toWeightProductResponses(product.getWeightProducts()))")
    ProductResponse toProductResponse(Product product);

    @Mapping(target = "weightProducts", ignore = true)
    @Mapping(target = "isActive", source = "active",defaultValue = "true")
    Product toProduct(ProductRequest productRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id_product", ignore = true)
    @Mapping(target = "image", ignore = true)
    void updateProduct(@MappingTarget Product product, ProductRequest request);

    default List<WeightProductResponse> toWeightProductResponses(Set<WeightProduct> weightProducts) {
        if (weightProducts == null) return null;
        return weightProducts.stream()
                .map(weightProduct -> WeightProductResponse.builder()
                        .id(weightProduct.getId())
                        .stock(weightProduct.getStock())
                        .weightType(toWeightTypeResponse(weightProduct.getWeightType()))
                        .build())
                .collect(Collectors.toList());
    }

    default WeightTypeResponse toWeightTypeResponse(WeightType weightType) {
        if (weightType == null) return null;
        return WeightTypeResponse.builder()
                .id_weight_type(weightType.getId())
                .unit(weightType.getUnit())
                .value(weightType.getValue())
                .build();
    }
}

