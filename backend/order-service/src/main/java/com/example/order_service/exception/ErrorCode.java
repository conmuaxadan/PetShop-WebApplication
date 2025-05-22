package com.example.order_service.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    INVALID_KEY(0,"Invalid key", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_NOT_FOUND(1000,"User not found",HttpStatus.NOT_FOUND),
    USER_INVALID_CREDENTIALS(1002,"Invalid username or password",HttpStatus.BAD_REQUEST),
    USER_ALREADY_EXISTS(1003,"User already exists",HttpStatus.BAD_REQUEST),
    USER_NOT_AUTHORIZED(1008,"User is not authorized",HttpStatus.FORBIDDEN),
    USER_NOT_AUTHENTICATED(1004,"User is not authorized",HttpStatus.UNAUTHORIZED),
    USER_ALREADY_ACTIVE(1005,"User is already active",HttpStatus.BAD_REQUEST),
    USER_EXISTED(1001,"User is existed",HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1002,"Username is invalid",HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1003,"Email is invalid",HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004,"Your password must be least {min} character",HttpStatus.BAD_REQUEST),
    BIRTHDAY_INVALID(1005,"Your age must be least {min}",HttpStatus.BAD_REQUEST),
    ID_USER_INVALID(1006,"Id user is invalid",HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_FOUND(1007,"Permission not found",HttpStatus.NOT_FOUND),
    ROLE_NOT_FOUND(1007,"Role not found",HttpStatus.NOT_FOUND),
    OUT_OF_STOCK(1102, "Sản phẩm không đủ hàng: %s", HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND(1017,"Order not found",HttpStatus.NOT_FOUND),
    INVALID_STATUS(2005,"Yêu cầu thay đổi trạng thái đơn hàng không hợp lệ",HttpStatus.NOT_FOUND),
    CANNOT_CANCEL_ORDER(2004,"Đơn hàng đã được vận chuyển, không thể yêu cầu hủy đơn",HttpStatus.BAD_REQUEST),
    CANNOT_RETURN_ORDER(2003,"Đơn hàng chưa giao thành công, không thể yêu cầu trả đơn",HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_EXCEPTION(9999,"uncategorized exception", HttpStatus.INTERNAL_SERVER_ERROR);
    private int code;
    private String message;
    private HttpStatusCode statusCode;

//     ErrorCode(int code, String message, HttpStatusCode statuscode ) {
//        this.code = code;
//        this.message = message;
//        this.statusCode = statuscode;
//    }
    public String formatMessage(Object... args) {
        return String.format(message, args);
    }
}
