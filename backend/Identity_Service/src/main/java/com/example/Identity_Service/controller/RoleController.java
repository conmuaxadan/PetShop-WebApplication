package com.example.Identity_Service.controller;

import com.example.Identity_Service.dto.response.ApiResponse;
import com.example.Identity_Service.dto.request.RoleRequest;
import com.example.Identity_Service.dto.response.PageResponse;
import com.example.Identity_Service.dto.response.RoleResponse;
import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import com.example.Identity_Service.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('MODERATOR')")
public class RoleController {
    RoleService roleService;

    // Get all Roles
    @GetMapping
    public ApiResponse<PageResponse<RoleResponse>> getAllRoles(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size,
            @RequestParam(value = "query", required = false, defaultValue = "") String query
    ){
        return ApiResponse.<PageResponse<RoleResponse>>builder()
                .data(roleService.getAllRoles(query,page,size))
                .build();
    }

    // Get Role by id
    @GetMapping("/{id}")
    public ApiResponse<RoleResponse> getRoleById(@PathVariable String id){
        RoleResponse Role = roleService.getRole(id);
        if(Role == null) throw new AppException(ErrorCode.ROLE_NOT_FOUND);
        return ApiResponse.<RoleResponse>builder()
                .data(Role)
                .build();
    }
    // Get Roles by role id
//    @GetMapping("/role/{roleId}")
//    public ApiResponse<List<RoleResponse>> getRolesByRoleId(@PathVariable String roleId){
//        List<RoleResponse> Roles = RoleService.getRolesByRoleId(roleId);
//        if(Roles.isEmpty()) throw new AppException(ErrorCode.Role_NOT_FOUND);
//        return ApiResponse.<List<RoleResponse>>builder()
//               .data(Roles)
//               .build();
//    }
    // update Roles
    @PutMapping("/{id}")
    public ApiResponse<RoleResponse> updateRole
    (@PathVariable String id, @RequestBody RoleRequest requestBody){
        RoleResponse Role = roleService.update(id, requestBody);
        if(Role == null) throw new AppException(ErrorCode.ROLE_NOT_FOUND);
        return ApiResponse.<RoleResponse>builder()
                .data(Role)
                .build();
    }
    @PostMapping
    public ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest requestBody){
        RoleResponse Role = roleService.create(requestBody);
        return ApiResponse.<RoleResponse>builder()
                .data(Role)
                .build();
    }
    // delete Roles
    @PatchMapping("/delete/{id}")
    public ApiResponse<Void> deleteRole(@PathVariable String id){
        roleService.deleteRole(id);
        return ApiResponse.<Void>builder()
                .message("Role deleted")
                .build();
    }
    // delete Roles
    @PatchMapping("/restore/{id}")
    public ApiResponse<Void> restoreRole(@PathVariable String id){
        roleService.restoreRole(id);
        return ApiResponse.<Void>builder()
                .message("Role restored")
                .build();
    }
}
