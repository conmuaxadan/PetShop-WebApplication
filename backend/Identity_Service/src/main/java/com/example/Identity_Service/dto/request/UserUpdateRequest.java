package com.example.Identity_Service.dto.request;

import com.example.Identity_Service.entity.Role;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {
    @Id
    private String id_user;

    @NotNull(message = "Tên người dùng không được để trống")
    @Size(min = 4, message = "USERNAME_INVALID")
    String username;
    String email;
    String avatar;

    Set<Role> roles;

}
