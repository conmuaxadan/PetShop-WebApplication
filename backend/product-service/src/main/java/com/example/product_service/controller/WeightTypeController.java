package com.example.product_service.controller;

import com.example.product_service.dto.request.WeightTypeRequest;
import com.example.product_service.dto.response.WeightTypeResponse;
import com.example.product_service.dto.response.ApiResponse;
import com.example.product_service.dto.response.PageResponse;
import com.example.product_service.exception.AppException;
import com.example.product_service.exception.ErrorCode;
import com.example.product_service.service.WeightTypeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/weight-types")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WeightTypeController {
    WeightTypeService weightTypeService;

    // Get all weight types
    @GetMapping
    public ApiResponse<PageResponse<WeightTypeResponse>> getAllWeightTypes(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ) {
        return ApiResponse.<PageResponse<WeightTypeResponse>>builder()
                .data(weightTypeService.getAllWeightTypes(page, size))
                .build();
    }


    // Delete a weight type
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteWeightType(@PathVariable Long id) {
        weightTypeService.deleteWeightType(id);
        return ApiResponse.<Void>builder()
                .build();
    }

    // Get weight type by id
    @GetMapping("/{id}")
    public ApiResponse<WeightTypeResponse> getWeightTypeById(@PathVariable Long id) {
        return ApiResponse.<WeightTypeResponse>builder()
                .data(weightTypeService.getWeightTypeById(id))
                .build();
    }

    // Post a new weight type
    @PostMapping
    public ApiResponse<WeightTypeResponse> createWeightType(@RequestBody WeightTypeRequest request) {
        return ApiResponse.<WeightTypeResponse>builder()
                .data(weightTypeService.createWeightType(request))
                .build();
    }

    // Update a weight type
    @PutMapping("/{id}")
    public ApiResponse<WeightTypeResponse> updateWeightType(@PathVariable Long id, @RequestBody WeightTypeRequest request) {
        WeightTypeResponse weightType = weightTypeService.updateWeightType(id, request);
        if (weightType == null) throw new AppException(ErrorCode.WEIGHT_TYPE_NOT_FOUND);
        return ApiResponse.<WeightTypeResponse>builder()
                .data(weightType)
                .build();
    }
}
