package com.example.product_service.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {
    long id_product;
    String name;
    Double oldPrice;
    Double price;
    String description;
    long id_category;
    String image;
    Boolean organic;
    String origin;
    String packaging;
    String brand;
    String howToUse;
    String howToPreserve;
    boolean isActive = true;
    List<WeightTypeRequest> weightTypes;

}
