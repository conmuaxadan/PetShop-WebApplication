package com.example.shipping_service.dto.request;

import com.example.shipping_service.configuration.OrderConfig;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderRequest {
    @NotBlank(message = "Order ID không được để trống")
    private String id;

    @NotBlank(message = "Tên người lấy hàng không được để trống")
    private String pick_name;

    @NotBlank(message = "Địa chỉ lấy hàng không được để trống")
    private String pick_address;

    @NotBlank(message = "Tỉnh/Thành phố lấy hàng không được để trống")
    private String pick_province;

    @NotBlank(message = "Quận/Huyện lấy hàng không được để trống")
    private String pick_district;

    private String pick_ward; // Không bắt buộc

    @NotBlank(message = "Số điện thoại nơi lấy hàng không được để trống")
    private String pick_tel;

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

    private String pick_option = "cod"; // Mặc định là cod hoac la post
    private ArrayList<Integer> tags;

    public void fromConfig(OrderConfig config) {
        this.pick_name = config.getPickName();
        this.pick_address = config.getPickAddress();
        this.pick_province = config.getPickProvince();
        this.pick_district = config.getPickDistrict();
        this.pick_ward = config.getPickWard();
        this.pick_tel = config.getPickTel();
        this.tags = new ArrayList<>(config.getTags());
    }


}
