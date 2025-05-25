package com.example.review_service.mapper;

import com.example.review_service.dto.request.ReviewRequest;
import com.example.review_service.dto.response.ReviewResponse;
import com.example.review_service.entity.Review;
import org.mapstruct.Mapper;
import org.springframework.cloud.openfeign.EnableFeignClients;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    // Mappers for ReviewService
    Review toReview (ReviewRequest request);
    ReviewResponse toReviewResponse (Review review);
    Review updateReview (long id, ReviewRequest request);
}
