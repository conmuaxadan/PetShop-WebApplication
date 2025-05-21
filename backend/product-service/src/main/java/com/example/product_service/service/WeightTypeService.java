package com.example.product_service.service;

import com.example.product_service.dto.request.WeightTypeRequest;
import com.example.product_service.dto.response.WeightTypeResponse;
import com.example.product_service.dto.response.PageResponse;
import com.example.product_service.entity.WeightType;
import com.example.product_service.mapper.WeightTypeMapper;
import com.example.product_service.repository.WeightTypeRepository;
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
public class WeightTypeService {
    WeightTypeRepository weightTypeRepository;
    WeightTypeMapper weightTypeMapper;

    // Method to fetch a weight type by id
    public WeightTypeResponse getWeightTypeById(Long weightTypeId) {
        return weightTypeMapper.toWeightTypeResponse(weightTypeRepository.findById(weightTypeId).orElse(null));
    }

    // Method to add a new weight type
    public WeightTypeResponse createWeightType(WeightTypeRequest weightTypeRequest) {
        log.info(weightTypeRequest.toString());
        WeightType weightType = weightTypeRepository.save(weightTypeMapper.toWeightType(weightTypeRequest));
        return weightTypeMapper.toWeightTypeResponse(weightType);
    }

    // Method to update a weight type
    public WeightTypeResponse updateWeightType(Long weightTypeId, WeightTypeRequest weightTypeRequest) {
        WeightType weightType = weightTypeMapper.updateWeightType(weightTypeId, weightTypeRequest);
        return weightTypeMapper.toWeightTypeResponse(weightTypeRepository.save(weightType));
    }

    // Method to delete a weight type
    public void deleteWeightType(Long weightTypeId) {
        weightTypeRepository.deleteById(weightTypeId);
    }


    public PageResponse<WeightTypeResponse> getAllWeightTypes(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<WeightType> weightTypePage = weightTypeRepository.findAll(pageable);

        List<WeightTypeResponse> weightTypeResponses = weightTypePage.getContent()
                .stream()
                .map(weightTypeMapper::toWeightTypeResponse)
                .toList();

        return PageResponse.<WeightTypeResponse>builder()
                .currentPage(page)
                .totalPages(weightTypePage.getTotalPages())
                .totalElements(weightTypePage.getTotalElements())
                .elements(weightTypeResponses)
                .build();
    }
}
