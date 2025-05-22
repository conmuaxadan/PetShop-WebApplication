package com.example.order_service.repository;

import com.example.order_service.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    @Query("SELECT o FROM Order o WHERE o.id_user = :userId " +
            "AND (:status IS NULL OR o.status = :status) " +
            "ORDER BY o.order_date DESC")
    Page<Order> findAllOrderByUserId(@Param("userId") String userId,
                                     @Param("status") Integer status,
                                     Pageable pageable);

    @Query("SELECT DATE(o.order_date) AS timePeriod, SUM(o.totalPrice) AS totalRevenue " +
            "FROM Order o " +
            "WHERE o.status = 3 " +
            "GROUP BY DATE(o.order_date)")
    List<Object[]> getDailyRevenue();

    @Query(value = "SELECT CONCAT(YEAR(o.order_date), '-W', LPAD(WEEK(o.order_date), 2, '0')) AS timePeriod, SUM(o.total_price) AS totalRevenue " +
            "FROM orders o " +
            "WHERE o.status = 3 " +
            "GROUP BY CONCAT(YEAR(o.order_date), '-W', LPAD(WEEK(o.order_date), 2, '0'))", nativeQuery = true)
    List<Object[]> getWeeklyRevenue();

    @Query(value = "SELECT CONCAT(YEAR(o.order_date), '-', LPAD(MONTH(o.order_date), 2, '0')) AS timePeriod, SUM(o.total_price) AS totalRevenue " +
            "FROM orders o " +
            "WHERE o.status = 3 " +
            "GROUP BY CONCAT(YEAR(o.order_date), '-', LPAD(MONTH(o.order_date), 2, '0'))", nativeQuery = true)
    List<Object[]> getMonthlyRevenue();

    @Query("SELECT YEAR(o.order_date) AS timePeriod, SUM(o.totalPrice) AS totalRevenue " +
            "FROM Order o " +
            "WHERE o.status = 3 " +
            "GROUP BY YEAR(o.order_date)")
    List<Object[]> getYearlyRevenue();

    @Query("SELECT AVG(monthlyRevenue.totalRevenue) " +
            "FROM (SELECT SUM(o.totalPrice) AS totalRevenue " +
            "FROM Order o " +
            "WHERE o.status = 3 " +
            "GROUP BY YEAR(o.order_date), MONTH(o.order_date)) AS monthlyRevenue")
    Double getAverageMonthlyRevenue();

    @Query("SELECT o FROM Order o WHERE " +
            "(:keyword IS NULL OR LOWER(o.id_order) LIKE LOWER(CONCAT(:keyword, '%')))")
    Page<Order> searchByQuery(Pageable pageable, @Param("keyword") String keyword);
}