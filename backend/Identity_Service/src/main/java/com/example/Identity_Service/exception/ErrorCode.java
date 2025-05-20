package com.example.Identity_Service.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    INVALID_KEY(0, "Khóa không hợp lệ", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_NOT_FOUND(1000, "Người dùng không tồn tại", HttpStatus.NOT_FOUND),
    USER_INVALID_CREDENTIALS(1002, "Tên đăng nhập hoặc mật khẩu không hợp lệ", HttpStatus.BAD_REQUEST),
    USER_ALREADY_EXISTS(1003, "Người dùng đã tồn tại", HttpStatus.BAD_REQUEST),
    ROLE_ALREADY_ACTIVE(1003, "Vai trò đã active", HttpStatus.BAD_REQUEST),
    ROLE_ALREADY_INACTIVE(1003, "Vai trò chưa được  active", HttpStatus.BAD_REQUEST),
    USER_NOT_ACTIVE(1003, "Người dùng chưa được  active", HttpStatus.BAD_REQUEST),
    USER_ALREADY_INACTIVE(1003, "Người dùng chưa được  active", HttpStatus.BAD_REQUEST),
    USER_NOT_AUTHORIZED(1008, "Người dùng không có quyền", HttpStatus.FORBIDDEN),
    USER_NOT_AUTHENTICATED(1004, "Người dùng chưa được xác thực", HttpStatus.UNAUTHORIZED),
    USER_ALREADY_ACTIVE(1005, "Người dùng đã được kích hoạt", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1001, "Người dùng đã tồn tại", HttpStatus.BAD_REQUEST),
    USERNAME_EXISTED(1111, "Tên người dùng đã tồn tại", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1112, "Email đã tồn tại", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1002, "Tên người dùng không hợp lệ", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1003, "Email không hợp lệ", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004, "Mật khẩu phải có ít nhất {min} ký tự", HttpStatus.BAD_REQUEST),
    BIRTHDAY_INVALID(1005, "Tuổi phải ít nhất {min}", HttpStatus.BAD_REQUEST),
    ID_USER_INVALID(1006, "ID người dùng không hợp lệ", HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_FOUND(1007, "Quyền không tồn tại", HttpStatus.NOT_FOUND),
    ROLE_NOT_FOUND(1007, "Vai trò không tồn tại", HttpStatus.NOT_FOUND),
    TOKEN_DELETED(2008,"Token đã bị thu hồi", HttpStatus.BAD_REQUEST),
    TOKEN_EXPIRED(2009,"Token đã hết hạn", HttpStatus.BAD_REQUEST),
    PASSWORD_WRONG(1009, "Mật khẩu không chính xác", HttpStatus.BAD_REQUEST),
    FILE_TOO_LARGE(2000, "File vượt quá kích thước cho phép (5MB)", HttpStatus.BAD_REQUEST),
    FILE_SAVE_ERROR(2001, "Không thể lưu file", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_FILE(2002, "File không được để trống", HttpStatus.BAD_REQUEST),
    INVALID_FILE_TYPE(2003, "Chỉ chấp nhận định dạng PNG, JPG", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi chưa xác định", HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
