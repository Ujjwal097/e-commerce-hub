package com.lumina.ecommerce.repository;

import com.lumina.ecommerce.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, String> {
    List<OrderEntity> findByUserIdOrderByIdDesc(String userId);
    List<OrderEntity> findAllByOrderByIdDesc();

    @Query("SELECT SUM(o.total) FROM OrderEntity o")
    Double calculateTotalRevenue();
}
