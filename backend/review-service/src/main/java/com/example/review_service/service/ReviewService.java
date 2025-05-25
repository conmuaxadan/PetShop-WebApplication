package com.example.review_service.service;

import com.example.review_service.dto.request.ReviewRequest;
import com.example.review_service.dto.response.PageResponse;
import com.example.review_service.dto.response.ReviewResponse;
import com.example.review_service.entity.Review;
import com.example.review_service.exception.AppException;
import com.example.review_service.exception.ErrorCode;
import com.example.review_service.mapper.ReviewMapper;
import com.example.review_service.repository.ProfileClientHttp;
import com.example.review_service.repository.ReviewRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewService {
    ReviewRepository reviewRepository;
    ReviewMapper reviewMapper;
    ProfileClientHttp profileClientHttp;
    // TODO: Implement review CRUD operations and business logic here.
    public ReviewResponse getReviewById(long id) {
        ReviewResponse review = reviewMapper.toReviewResponse(
                reviewRepository.findById(id).orElse(null));
        log.info(profileClientHttp.getProfile(review.getId_user()).toString());
        review.setReviewerResponse(profileClientHttp.getProfile(review.getId_user()).getData());
        return (review);
    }
    public PageResponse<ReviewResponse> getReviews(int page, int size){
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Review> profilePage = reviewRepository.findAll(pageable);
        List<ReviewResponse> reviews = profilePage.getContent()
                .stream()
                .map(reviewMapper::toReviewResponse)
                .peek(reviewResponse -> {
                    reviewResponse.setReviewerResponse(
                            profileClientHttp.getProfile(reviewResponse.getId_user()).getData());
                })
                .toList();
        return PageResponse.<ReviewResponse>builder()
                .currentPage(page)
                .totalPages(profilePage.getTotalPages())
                .totalElements(profilePage.getTotalElements())
                .elements(reviews)
                .build();
    }
    public PageResponse<ReviewResponse> searchReviews(String keyword, int page, int size){
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Review> reviewPage = reviewRepository.searchReviews(keyword, pageable);

        List<ReviewResponse> productResponses = reviewPage.getContent()
                .stream()
                .map(reviewMapper::toReviewResponse)
                .toList();

        return PageResponse.<ReviewResponse>builder()
                .currentPage(page)
                .totalPages(reviewPage.getTotalPages())
                .totalElements(reviewPage.getTotalElements())
                .elements(productResponses)
                .build();
    }

    public ReviewResponse createReview(ReviewRequest request) {
        ReviewResponse reviewResponse = reviewMapper.toReviewResponse(reviewRepository
                .save(reviewMapper.toReview(request)));
        reviewResponse.setReviewerResponse(
                profileClientHttp.getProfile(reviewResponse.getId_user()).getData());
        return reviewResponse;
    }
    public void updateReview(long id,ReviewRequest request) {
        Review review = reviewRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.REVIEW_NOT_FOUND));
        reviewMapper.updateReview(id, request);
        reviewRepository.save(review);
    }

    public void deleteReview(long id){
        reviewRepository.deleteById(id);
    }

    public List<ReviewResponse> getReviewsByProductId(long productId){
        return reviewRepository.findReviewByIdProductOrderByCreateDateDesc(productId).stream()
                .map(reviewMapper::toReviewResponse)
                .peek(reviewResponse -> {
                    reviewResponse.setReviewerResponse(
                            profileClientHttp.getProfile(reviewResponse.getId_user()).getData());
                })
                .toList();
    }
}
