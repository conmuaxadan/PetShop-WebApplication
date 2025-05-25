package com.example.review_service.repository;

import com.example.review_service.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Long> {


    @Query("SELECT r FROM Review r WHERE r.id_product = :idProduct " +
            "ORDER BY r.create_date DESC")
    List<Review> findReviewByIdProductOrderByCreateDateDesc(
            @Param("idProduct") long idProduct);

    @Query("SELECT r FROM Review r WHERE " +
            "LOWER(r.content) LIKE LOWER(CONCAT('%', :keyword, '%')) "
    )
    Page<Review> searchReviews(String keyword, Pageable pageable);
}
