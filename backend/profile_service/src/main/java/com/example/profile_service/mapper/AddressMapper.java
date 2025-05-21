package com.example.profile_service.mapper;


import com.example.profile_service.dto.request.AddressRequest;
import com.example.profile_service.dto.response.AddressResponse;
import com.example.profile_service.entity.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    Address toAddress(AddressRequest request);
    @Mapping(target = "id_address", ignore = true)
    void updateAddress(@MappingTarget Address address, AddressRequest request);

    AddressResponse toAddressResponse(Address address);
}
