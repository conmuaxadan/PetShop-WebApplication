package com.example.review_service.controller;

import com.example.review_service.dto.request.ReviewRequest;
import com.example.review_service.dto.response.ApiResponse;
import com.example.review_service.dto.response.PageResponse;
import com.example.review_service.dto.response.ReviewResponse;
import com.example.review_service.exception.AppException;
import com.example.review_service.exception.ErrorCode;
import com.example.review_service.service.ReviewService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/")
public class ReviewController {
    ReviewService reviewService;
    // Get all reviews
    @GetMapping
    public ApiResponse<PageResponse<ReviewResponse>> getAllReviews(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size
    ){
        return ApiResponse.<PageResponse<ReviewResponse>>builder()
                .data(reviewService.getReviews(page,size))
                .build();
    }
    //search
    @GetMapping("/search")
    public ApiResponse<PageResponse<ReviewResponse>> searchReviews(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size)
    {
                return ApiResponse.<PageResponse<ReviewResponse>>builder()
                       .data(reviewService.searchReviews(keyword, page, size))
                       .build();
    }
    // Get review by id
    @GetMapping("/{id}")
    public ApiResponse<ReviewResponse> getReviewById(@PathVariable long id){
        ReviewResponse review = reviewService.getReviewById(id);
        if(review == null) throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        return ApiResponse.<ReviewResponse>builder()
               .data(review)
               .build();
    }
    // Get reviews by product id
    @GetMapping("/product/{productId}")
    public ApiResponse<List<ReviewResponse>> getReviewsByProductId(@PathVariable long productId){
        List<ReviewResponse> reviews = reviewService.getReviewsByProductId(productId);
        if(reviews.isEmpty()) throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        return ApiResponse.<List<ReviewResponse>>builder()
               .data(reviews)
               .build();
    }
    // Create review
    @PostMapping
    public ApiResponse<ReviewResponse> createReview(@RequestBody ReviewRequest request){
        ReviewResponse review = reviewService.createReview(request);
        return ApiResponse.<ReviewResponse>builder()
               .data(review)
               .build();
    }
    // Update review
    @PutMapping("/{id}")
    public ApiResponse<Void> updateReview(@PathVariable long id, @RequestBody ReviewRequest request){
        reviewService.updateReview(id, request);
        return ApiResponse.<Void>builder()
               .build();
    }

    // Delete review
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteReview(@PathVariable long id){
        ReviewResponse review = reviewService.getReviewById(id);
        if(review == null) throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        reviewService.deleteReview(id);
        return ApiResponse.<Void>builder()
               .build();
    }
}
