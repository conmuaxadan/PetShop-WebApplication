package com.example.profile_service.service;

import com.example.profile_service.dto.request.AddressRequest;
import com.example.profile_service.dto.request.AdminUpdationProfileRequest;
import com.example.profile_service.dto.request.CreationProfileRequest;
import com.example.profile_service.dto.request.UpdationProfileRequest;
import com.example.profile_service.dto.response.PageResponse;
import com.example.profile_service.dto.response.ProfileResponse;
import com.example.profile_service.entity.Address;
import com.example.profile_service.entity.Profile;
import com.example.profile_service.exception.AppException;
import com.example.profile_service.exception.ErrorCode;
import com.example.profile_service.mapper.ProfileMapper;
import com.example.profile_service.repository.AddressRepository;
import com.example.profile_service.repository.ProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProfileService {
    ProfileRepository profileRepository;
    ProfileMapper profileMapper;
    AddressRepository addressRepository;

    public void saveAddress(AddressRequest request, String idUser) {
            // Nếu có ID, kiểm tra xem có tồn tại không
       Optional<Profile> profileOp = profileRepository.findById(idUser);
        if(profileOp.isPresent()){
            Profile profile = profileOp.get();
                Address newAddress = Address.builder()
                        .province(request.getProvince())
                        .district(request.getDistrict())
                        .ward(request.getWard())
                        .hamlet(request.getHamlet())
                        .postalCode(request.getPostalCode())
                        .build();
                profile.setAddress(newAddress);
                profileRepository.save(profile);
        }

    }
    public  ProfileResponse saveProfile(CreationProfileRequest request){
        return profileMapper.toProfileResponse(
                profileRepository.save(profileMapper.toProfile(request)));
    }


    public void updateProfile(String userId, UpdationProfileRequest request) {
        Profile profile = profileRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.PROFILE_NOT_FOUND));
        log.info(request.toString());
       if(request.getFirstName()!=null){
           profile.setFirstName(request.getFirstName());
       }
       if(request.getLastName()!=null){
           profile.setLastName(request.getLastName());
       }
        profileRepository.save(profile);
    }
    public void updateProfile(String userId, AdminUpdationProfileRequest request) {
        Profile profile = profileRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.PROFILE_NOT_FOUND));

       profileMapper.updateProfile(profile,request);
      log.info( profileRepository.save(profile).toString());
    }


    public void deleteProfile(String id) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND));
        if (!profile.isActive()) {
            throw new AppException(ErrorCode.PROFILE_ALREADY_INACTIVE);
        }
        profile.setActive(false);
        profileRepository.save(profile);
    }

    public void restoreProfile(String id) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND));
        if (profile.isActive()) {
            throw new AppException(ErrorCode.PROFILE_ALREADY_ACTIVE);
        }
        profile.setActive(true);
        profileRepository.save(profile);
    }
    // change phone
    public void updatePhone(String userId, String phone) {
        Profile profile = profileRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND));
        profile.setPhone(phone);
        profileRepository.save(profile);
    }
    public ProfileResponse getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = jwt.getClaim("id_user");
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!profile.isActive()) {
            throw new AppException(ErrorCode.PROFILE_NOT_FOUND);
        }
        return profileMapper.toProfileResponse(profile);
    }
    public ProfileResponse getProfileById(String userId) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND));
        return profileMapper.toProfileResponse(profile);
    }
    //change email
    public void updateEmail(String userId, String email) {
        Profile profile = profileRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND));
        profile.setEmail(email);
        profileRepository.save(profile);
    }
    public PageResponse<ProfileResponse> getAllProfiles(String keyword, int page, int size){
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Profile> productPage = profileRepository.searchUsers(keyword, pageable);

        List<ProfileResponse> productResponses = productPage.getContent()
                .stream()
                .map(profileMapper::toProfileResponse)
                .toList();

        return PageResponse.<ProfileResponse>builder()
                .currentPage(page)
                .totalPages(productPage.getTotalPages())
                .totalElements(productPage.getTotalElements())
                .elements(productResponses)
                .build();
    }


}