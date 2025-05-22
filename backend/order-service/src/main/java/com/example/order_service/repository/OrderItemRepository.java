package com.example.order_service.repository;

import com.example.order_service.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, String> {
    @Query(nativeQuery = true, value =
            "SELECT oi.product_code AS productCode, oi.name AS name, " +
                    "SUM(oi.quantity) AS quantity, SUM(oi.quantity * oi.price) AS revenue " +
                    "FROM order_item oi " +
                    "JOIN orders o ON oi.id_order = o.id_order " +
                    "WHERE :timeframe = 'all' OR " +
                    "(:timeframe = 'daily' AND o.order_date >= CURRENT_DATE) OR " +
                    "(:timeframe = 'weekly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)) OR " +
                    "(:timeframe = 'monthly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)) OR " +
                    "(:timeframe = 'yearly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 365 DAY)) " +
                    "GROUP BY oi.product_code, oi.name " +
                    "ORDER BY revenue DESC")
    List<Object[]> findTopProductsByRevenue(@Param("timeframe") String timeframe);

    // New top-customers query
    @Query(nativeQuery = true, value =
            "SELECT o.id_user AS userId, o.customer_name AS customerName, " +
                    "COUNT(o.id_order) AS totalOrders, SUM(o.value) AS totalValue " +
                    "FROM orders o " +
                    "WHERE :timeframe = 'all' OR " +
                    "(:timeframe = 'daily' AND o.order_date >= CURRENT_DATE) OR " +
                    "(:timeframe = 'weekly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)) OR " +
                    "(:timeframe = 'monthly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)) OR " +
                    "(:timeframe = 'yearly' AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 365 DAY)) " +
                    "GROUP BY o.id_user, o.customer_name " +
                    "ORDER BY totalValue DESC")
    List<Object[]> findTopCustomersByValue(@Param("timeframe") String timeframe);
}

