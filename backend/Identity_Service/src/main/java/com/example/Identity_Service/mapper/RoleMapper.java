package com.example.Identity_Service.mapper;

import com.example.Identity_Service.dto.request.PermissionRequest;
import com.example.Identity_Service.dto.request.RoleRequest;
import com.example.Identity_Service.dto.response.RoleResponse;
import com.example.Identity_Service.entity.Role;
import com.example.Identity_Service.entity.Permission;
import org.mapstruct.*;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;
@Mapper(componentModel = "spring", uses = PermissonMapper.class)
public interface RoleMapper {

    Role toRole(RoleRequest roleRequest);

    @Mapping(target = "isActive", source = "active")
    RoleResponse toRoleResponse(Role role);

    @Mapping(target = "name", ignore = true)
    void updateRole(@MappingTarget Role role, RoleRequest roleRequest);

    // 👇 Bổ sung hàm convert PermissionRequest -> Permission
    default Set<Permission> mapPermissions(Set<com.example.Identity_Service.dto.request.PermissionRequest> requests) {
        if (requests == null) return null;

        Set<Permission> result = new LinkedHashSet<>();
        for (com.example.Identity_Service.dto.request.PermissionRequest request : requests) {
            result.add(Permission.builder()
                            .name(request.getName())
                            .description(request.getDescription())
                    .build());
        }
        return result;
    }
}

