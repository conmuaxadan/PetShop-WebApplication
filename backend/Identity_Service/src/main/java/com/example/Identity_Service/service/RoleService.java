package com.example.Identity_Service.service;

import com.example.Identity_Service.dto.request.RoleRequest;
import com.example.Identity_Service.dto.response.PageResponse;
import com.example.Identity_Service.dto.response.RoleResponse;
import com.example.Identity_Service.entity.Role;
import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import com.example.Identity_Service.mapper.RoleMapper;
import com.example.Identity_Service.repository.PermissionRepository;
import com.example.Identity_Service.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;

    @CacheEvict(value = {"roles", "rolesList"}, allEntries = true)
    public RoleResponse create(RoleRequest roleRequest) {
        Role role = roleMapper.toRole(roleRequest);
        Role savedRole = roleRepository.save(role);
        return roleMapper.toRoleResponse(savedRole);
    }

    @CacheEvict(value = {"roles", "rolesList"}, allEntries = true)
    public RoleResponse update(String name, RoleRequest roleRequest) {
        Role role = roleRepository.findById(name).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        roleMapper.updateRole(role, roleRequest);
        Role updatedRole = roleRepository.save(role);
        return roleMapper.toRoleResponse(updatedRole);
    }

    @CacheEvict(value = {"roles", "rolesList"}, allEntries = true)
    public void deleteRole(String name) {
        Role role = roleRepository.findById(name).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        if (!role.isActive()) {
            throw new AppException(ErrorCode.ROLE_ALREADY_INACTIVE);
        }
        role.setActive(false);
        roleRepository.save(role);
    }

    @CacheEvict(value = {"roles", "rolesList"}, allEntries = true)
    public void restoreRole(String name) {
        Role role = roleRepository.findById(name).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        if (role.isActive()) {
            throw new AppException(ErrorCode.ROLE_ALREADY_ACTIVE);
        }
        role.setActive(true);
        roleRepository.save(role);
    }

    @Cacheable(value = "roles", key = "#name")
    public RoleResponse getRole(String name) {
        Role role = roleRepository.findById(name).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        return roleMapper.toRoleResponse(role);
    }

    @Cacheable(value = "rolesList")
    public PageResponse<RoleResponse> getAllRoles(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Role> rolePage = roleRepository.searchRoles(keyword, pageable);
        log.info("roleResponse: "+ rolePage);
        List<RoleResponse> roles = rolePage.getContent()
                .stream()
                .map(roleMapper::toRoleResponse)
                .toList();
        log.info("roleResponse: "+ roles);
        return PageResponse.<RoleResponse>builder()
                .currentPage(page)
                .totalPages(rolePage.getTotalPages())
                .totalElements(rolePage.getTotalElements())
                .elements(roles)
                .build();
    }
}