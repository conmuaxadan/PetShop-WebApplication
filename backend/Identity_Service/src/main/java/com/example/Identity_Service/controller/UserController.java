package com.example.Identity_Service.controller;


import com.example.Identity_Service.FileUtils;
import com.example.Identity_Service.dto.request.ChangePasswordRequest;
import com.example.Identity_Service.dto.request.UserCreationRequest;
import com.example.Identity_Service.dto.request.UserUpdateRequest;
import com.example.Identity_Service.dto.request.UsernameRequest;
import com.example.Identity_Service.dto.response.ApiResponse;
import com.example.Identity_Service.dto.response.ReviewerResponse;
import com.example.Identity_Service.dto.response.UserResponse;
import com.example.Identity_Service.entity.User;
import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import com.example.Identity_Service.service.UserService;
import com.example.event.dto.ChangeEmailRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @KafkaListener(topics = "change-email", groupId = "notification-group")
    public void changeEmail(ChangeEmailRequest request){
        userService.updateEmail(request.getUserId(), request.getEmail());
    }

    @PostMapping(value ="/registration")
    public ApiResponse<UserResponse> createUser(@Valid @RequestBody UserCreationRequest request,
                      @RequestPart(value = "file", required = false) MultipartFile file) throws JsonProcessingException {
        return ApiResponse.<UserResponse>builder()
                .data(userService.createUser(request,file))
                .build();
    }
    //change password
    @PutMapping("/change-password/{idUser}")
    public ApiResponse<Void> changePassword(
            @PathVariable String idUser,
            @Valid @RequestBody ChangePasswordRequest request){
        userService.changePassword(idUser,request);
        return ApiResponse.<Void>builder()
               .message("Password changed successfully")
               .build();
    }
    @GetMapping("/{id}")
    public  ApiResponse<UserResponse> getUserById(@PathVariable String id){
        UserResponse user =  userService.getUserById(id);
        if(user == null) throw new RuntimeException("User not found");
        return ApiResponse.<UserResponse>builder()
                .data(user)
                .build();
    }


    @GetMapping("/reviewer/{id_user}")
    public ApiResponse<ReviewerResponse> getReviewer(@PathVariable String id_user) {
        ReviewerResponse user =  userService.getReviewer(id_user);
        if(user == null) throw new RuntimeException("Reviewer not found");
        return ApiResponse.<ReviewerResponse>builder()
               .data(user)
               .build();
    }

    @GetMapping("my-info")
    public  ApiResponse<UserResponse> getMe(){
        UserResponse user =  userService.getMyInfor();
        if(user == null) throw new RuntimeException("User not found");
        return ApiResponse.<UserResponse>builder()
                .data(user)
                .build();
    }
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id){
        userService.deleteUser(id);
    }
    @PostMapping(value = "/upload-avatar",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<UserResponse> uploadAvatar(
            @RequestParam("userId") String userId,  // Nhận userId từ request
            @RequestPart("file") MultipartFile file) throws AppException {

        try {

            // Lưu ảnh
            String imagePath = FileUtils.saveImage(file);
            if (imagePath == null || imagePath.isEmpty()) {
                throw new AppException(ErrorCode.FILE_SAVE_ERROR);
            }

            UserResponse response = userService.saveImage(imagePath,userId);

            return ApiResponse.<UserResponse>builder()
                    .data(response)
                    .build();
        } catch (AppException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }
    @PutMapping("username/{id}")
    public ApiResponse<UserResponse> updateUsername(@PathVariable String id, @RequestBody UsernameRequest request){
        return ApiResponse.<UserResponse> builder()
                .data(userService.updateUsername(id, request.getUsername()))
               .build();
    }


}
