package com.example.product_service.repository;

import com.example.product_service.entity.WeightType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeightTypeRepository extends JpaRepository<WeightType,Long> {

}
