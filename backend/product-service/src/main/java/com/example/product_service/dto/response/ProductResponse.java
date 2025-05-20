package com.example.product_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse implements Serializable {
    long id_product;
    String name;
    Double price;
    Double oldPrice;
    String description;
    int average_rating;
    List<ReviewResponse> reviews;
    CategoryResponse category;
    String image;
    boolean organic;
    String origin;
    String packaging;
    String brand;
    String howToUse;
    String howToPreserve;
    List<WeightProductResponse> weightProducts;
     boolean isActive;

}
