package com.example.order_service.enums;

import lombok.Getter;

@Getter
public enum OrderStatus {
    PENDING_CONFIRMATION(0, "Đang chờ xác nhận"),
    WAITING_FOR_SHIPMENT(1, "Chờ giao hàng"),
    SHIPPING(2, "Đang giao hàng"),
    DELIVERED(3, "Giao hàng thành công"),
    CANCELED(4, "Đơn hàng bị hủy"),
    RETURN_REQUESTED(-1, "Đang yêu cầu trả hàng"),
    RETURN_APPROVED(-2, "Yêu cầu trả hàng đã được duyệt"),
    WAITING_FOR_PICKUP(-3, "Chờ nhân viên tới lấy hàng"),
    RETURNED(-4, "Trả hàng");

    private final int code;
    private final String description;

    OrderStatus(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static OrderStatus fromCode(int code) {
        for (OrderStatus status : OrderStatus.values()) {
            if (status.code == code) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái tương ứng với mã: " + code);
    }
    public static OrderStatus fromGHTKStatus(int ghtkStatus) {
        return switch (ghtkStatus) {
            case 1 -> PENDING_CONFIRMATION;
            case 2 -> WAITING_FOR_SHIPMENT;
            case 3 -> WAITING_FOR_PICKUP;
            case 5 -> SHIPPING;
            case 6 -> DELIVERED;
            case 8 -> RETURN_APPROVED;
            case 9 -> RETURNED;
            default -> CANCELED;
        };
    }
}
