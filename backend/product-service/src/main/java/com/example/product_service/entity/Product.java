package com.example.product_service.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "Product")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id_product;
    String name;
    Double price;
    String description;
    Double oldPrice;
    @ManyToOne
    Category category;
    String image;
    Boolean organic;
    String origin;
    String packaging;
    String brand;
    String howToUse;
    String howToPreserve;
    @OneToMany(mappedBy = "product",fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    Set<WeightProduct> weightProducts;
    boolean isActive = true;
}
