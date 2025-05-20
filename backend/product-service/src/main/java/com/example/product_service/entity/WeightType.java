package com.example.product_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class WeightType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String unit ="kg";
    private double value;

    @OneToMany(mappedBy = "weightType", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<WeightProduct> productWeights;
}
