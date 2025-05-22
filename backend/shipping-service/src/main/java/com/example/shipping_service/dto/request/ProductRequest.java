package com.example.shipping_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    private Integer price; // Giá trị hàng hóa (không bắt buộc)

    @NotNull(message = "Khối lượng sản phẩm không được để trống")
    @Min(value = 0, message = "Khối lượng sản phẩm phải lớn hơn 0")
    private Double weight;

    private Integer quantity = 1; // Số lượng hàng hóa (mặc định là 1)

    private String productCode; // Không bắt buộc
}
