package com.example.product_service.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemRequest {
    String id_order_item;
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    private Integer price; // Giá trị hàng hóa (không bắt buộc)

    @NotNull(message = "Khối lượng sản phẩm không được để trống")
    @Min(value = 0, message = "Khối lượng sản phẩm phải lớn hơn 0")
    private Double weight;

    private Integer quantity = 1;

    private String productCode; // Không bắt buộc

}
