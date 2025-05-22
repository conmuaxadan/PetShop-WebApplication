package com.example.order_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Table(name = "orders")
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id_order;

    String id_user;
    String customerName ;
    Double totalPrice;
    @Column(nullable = false)
    int status = 0 ;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    Timestamp order_date;

    String note;

    // Thông tin địa chỉ
    String address;
    String province;
    String district;
    String ward;
    String hamlet;

    // Thông tin liên hệ
    String tel;

    // Thông tin vận chuyển và  thanh toán
    @ColumnDefault("0")
    Integer is_freeship;

    @ColumnDefault("'cod'")
    String pick_option;

    @Column(nullable = false)
    private Double pick_money = 0.0;

    double shipping_fee;
    @Column(nullable = false)
    Double value;
    String payment_method;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    List<OrderItem> orderItems = new ArrayList<>();
}
