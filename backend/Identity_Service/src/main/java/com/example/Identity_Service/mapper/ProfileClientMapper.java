package com.example.Identity_Service.mapper;

import com.example.Identity_Service.dto.request.CreationProfileRequest;
import com.example.Identity_Service.dto.request.UserCreationRequest;
import com.example.Identity_Service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.context.annotation.Profile;

@Mapper(componentModel = "spring")
public interface ProfileClientMapper {
    CreationProfileRequest toCreateProfileRequest(UserCreationRequest request);
}
