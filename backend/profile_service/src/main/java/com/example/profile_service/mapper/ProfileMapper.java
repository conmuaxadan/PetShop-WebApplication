package com.example.profile_service.mapper;

import com.example.profile_service.dto.request.AdminUpdationProfileRequest;
import com.example.profile_service.dto.request.CreationProfileRequest;
import com.example.profile_service.dto.request.AddressRequest;
import com.example.profile_service.dto.request.UpdationProfileRequest;
import com.example.profile_service.dto.response.ProfileResponse;
import com.example.profile_service.entity.Address;
import com.example.profile_service.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    @Mapping(target = "isActive", source = "active")
    Profile toProfile(CreationProfileRequest profileRequest);

    @Mapping(target = "id_user", ignore = true)
    @Mapping(target = "address", source = "address", qualifiedByName = "updateAddress")
    void updateProfile(@MappingTarget Profile profile, AdminUpdationProfileRequest request);

    @Mapping(target = "isActive", source = "active")
    ProfileResponse toProfileResponse(Profile user);

    @Named("updateAddress")
    default void updateAddress(@MappingTarget Address target, AddressRequest source) {
        if (source == null) {
            return;
        }
        target.setProvince(source.getProvince() != null ? source.getProvince() : target.getProvince());
        target.setDistrict(source.getDistrict() != null ? source.getDistrict() : target.getDistrict());
        target.setWard(source.getWard() != null ? source.getWard() : target.getWard());
        target.setHamlet(source.getHamlet() != null ? source.getHamlet() : target.getHamlet());
        target.setPostalCode(source.getPostalCode() != null ? source.getPostalCode() : target.getPostalCode());
    }
}