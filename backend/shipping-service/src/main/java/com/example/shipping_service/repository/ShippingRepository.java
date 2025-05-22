package com.example.shipping_service.repository;

import com.example.shipping_service.entity.ShippingInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShippingRepository extends JpaRepository<ShippingInfo, String> {
    public ShippingInfo findByOrderId(String orderId);
}
