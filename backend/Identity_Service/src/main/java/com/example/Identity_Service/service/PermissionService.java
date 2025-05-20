package com.example.Identity_Service.service;

import com.example.Identity_Service.dto.request.PermissionRequest;
import com.example.Identity_Service.dto.response.PageResponse;
import com.example.Identity_Service.dto.response.PermissionResponse;
import com.example.Identity_Service.entity.Permission;
import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import com.example.Identity_Service.mapper.PermissonMapper;
import com.example.Identity_Service.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissonMapper permissionMapper;

    @CacheEvict(value = "permissionsList", allEntries = true)
    @CachePut(value = "permissions", key = "#result.name")
    public PermissionResponse create (PermissionRequest permissionRequest){
       Permission permission = permissionRepository.save(permissionMapper.toPermission(permissionRequest));
        return permissionMapper.toPermissionResponse(permission);
    }
    @CacheEvict(value = {"permissions","permissionsList"}, key = "#name", allEntries = true)
    public PermissionResponse update (String name, PermissionRequest permissionRequest){
        Permission permission = permissionRepository.findById(name).orElseThrow(()
                -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));
        permissionMapper.updatePermission(permission,permissionRequest);
        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }

    @Cacheable(value = "permissions", key = "#name")
    public PermissionResponse getPermission(String name){
        Permission permission = permissionRepository.findById(name).orElseThrow(()
                -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));
        return permissionMapper.toPermissionResponse(permission);
    }
    @CacheEvict(value = {"permissions","permissionsList"}, key = "#name", allEntries = true)
    public void deletePermission(String name){
        Permission permission = permissionRepository.findById(name).orElseThrow(()
                -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));
        permissionRepository.delete(permission);
    }
    @Cacheable(value = "permissionsList")
    public PageResponse<PermissionResponse> getAllPermissions(int page, int size){
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Permission> permissionsPage = permissionRepository.findAll(pageable);
        List<PermissionResponse> permissionResponses = permissionsPage.getContent()
                .stream()
                .map(permissionMapper::toPermissionResponse)
                .toList();
        return PageResponse.<PermissionResponse>builder()
                .currentPage(page)
                .totalPages(permissionsPage.getTotalPages())
                .totalElements(permissionsPage.getTotalElements())
                .elements(permissionResponses)
                .build();
    }
    public PageResponse<PermissionResponse> searchPermissions(String keyword, int page, int size){
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Permission> permissionsPage = permissionRepository.searchPermission(keyword, pageable);

        List<PermissionResponse> permissionResponses = permissionsPage.getContent()
                .stream()
                .map(permissionMapper::toPermissionResponse)
                .toList();
        return PageResponse.<PermissionResponse>builder()
                .currentPage(page)
                .totalPages(permissionsPage.getTotalPages())
                .totalElements(permissionsPage.getTotalElements())
                .elements(permissionResponses)
                .build();
    }
}
