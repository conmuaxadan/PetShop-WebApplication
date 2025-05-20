package com.example.Identity_Service.dto.response;

import com.example.Identity_Service.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse implements Serializable {
    String id_user;
    String username;
    String email;
    String avatar;
    Set<RoleResponse> roles;
    boolean active =true;
}
