package com.example.product_service.repository;

import com.example.product_service.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long>, JpaSpecificationExecutor<Product> {
    @Query("SELECT p FROM Product p JOIN p.category c WHERE c.id_category = ?1")
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable  );
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> searchProducts(String keyword, Pageable pageable);
//    @Query(value = "SELECT * FROM product p " +
//            "JOIN "category" c ON p.category_id = c.id " +
//            "WHERE MATCH(p.name, p.description, p.brand) AGAINST(:keyword IN BOOLEAN MODE) " +
//            "OR MATCH(c.name) AGAINST(:keyword IN BOOLEAN MODE)",
//            nativeQuery = true)
//    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);
}
