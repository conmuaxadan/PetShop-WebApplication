package com.example.order_service.dto.request;

import com.example.order_service.configuration.OrderConfig;
import com.example.order_service.entity.OrderItem;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderRequest {

    @NotBlank(message = "Order ID không được để trống")
    private String id;
    @NotBlank(message = "ID người nhận hàng không được để trống")
    private String id_user;

    @NotBlank(message = "Tên người nhận hàng không được để trống")
    private String name;

    private String address;

    @NotBlank(message = "Tỉnh/Thành phố của người nhận hàng không được để trống")
    private String province;

    @NotBlank(message = "Quận/Huyện của người nhận hàng không được để trống")
    private String district;

    @NotBlank(message = "Phường/Xã hoặc Đường/Phố phải có giá trị")
    private String ward;

    private String hamlet;

    @NotBlank(message = "Số điện thoại người nhận hàng không được để trống")
    private String tel;

    @NotNull(message = "Số tiền COD không được để trống")
    @Min(value = 0, message = "Số tiền COD phải lớn hơn hoặc bằng 0")
    private Integer pick_money;

    @NotNull(message = "Giá trị đóng bảo hiểm không được để trống")
    @Min(value = 0, message = "Giá trị đóng bảo hiểm phải lớn hơn hoặc bằng 0")
    private Integer value;

    private String note; // Không bắt buộc

    private Integer is_freeship = 0; // Mặc định là 0 (không freeship)

    private String pick_option = "cod"; // Mặc định là cod

    private String payment_method;

    List<OrderItemRequest> orderItems = new ArrayList<>();

}
