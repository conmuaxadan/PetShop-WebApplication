package com.example.Identity_Service.mapper;

import com.example.Identity_Service.dto.request.UserCreationRequest;
import com.example.Identity_Service.dto.request.UserUpdateRequest;
import com.example.Identity_Service.dto.response.UserResponse;
import com.example.Identity_Service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "isActive", source = "active")
    User ToUser(UserCreationRequest user);
    @Mapping(target = "id_user", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest rq);
    @Mapping(target = "avatar", source = "avatar", qualifiedByName = "getAvatarUrl")
    @Mapping(target = "active", source = "active")
    UserResponse toUserResponse(User user);
    @Named("getAvatarUrl")
    default String getAvatarUrl(String avatar) {
        if (avatar == null || avatar.isEmpty()) {
            return null;
        }
       return "http://localhost:8080/identity" + avatar;
    }
}
