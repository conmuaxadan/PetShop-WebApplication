package com.example.order_service.dto.response;

import com.example.order_service.entity.OrderItem;
import com.example.order_service.enums.OrderStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    String id;

    ProfileResponse customer;

    Double totalPrice;
     OrderStatus status;
    String customerName ;
    Timestamp orderDate;

    String note;

    // Thông tin địa chỉ
    String address;
    String province;
    String district;
    String ward;
    String hamlet;

    // Thông tin liên hệ
    String tel;

    // Thông tin vận chuyển và thanh toán

    @NotNull(message = "Số tiền COD không được để trống")
    @Min(value = 0, message = "Số tiền COD phải lớn hơn hoặc bằng 0")
    private Integer pick_money;
     Integer value;
     Integer is_freeship ;
    private String pick_option;
    @ToString.Exclude
    List<OrderItem> orderItems = new ArrayList<>();
}
