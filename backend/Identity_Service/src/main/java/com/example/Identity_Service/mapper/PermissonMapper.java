package com.example.Identity_Service.mapper;

import com.example.Identity_Service.dto.request.PermissionRequest;
import com.example.Identity_Service.dto.response.PermissionResponse;
import com.example.Identity_Service.entity.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PermissonMapper {
    Permission toPermission(PermissionRequest permissionRequest);
    PermissionResponse toPermissionResponse(Permission permission);
    @Mapping(target = "name", ignore = true)
    void updatePermission(@MappingTarget Permission permission, PermissionRequest permissionRequest);
}
