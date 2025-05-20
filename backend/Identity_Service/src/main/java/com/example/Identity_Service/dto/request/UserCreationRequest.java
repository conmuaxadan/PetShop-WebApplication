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
public class UserCreationRequest {

    @NotNull(message = "Tên người dùng không được để trống")
    @Size(min = 4, message = "USERNAME_INVALID")
    String username;
    String email;
    String avatar;


    @Size(min=8, message = "PASSWORD_INVALID")
    String password;
    String loginType;
    Set<Role> roles;
    boolean active = true;
//    @DobValidator(min=3, message = "BIRTHDAY_INVALID")
}
