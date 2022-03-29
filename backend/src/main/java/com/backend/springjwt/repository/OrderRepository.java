package com.backend.springjwt.repository;


import com.backend.springjwt.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
        List<Order> findByCompleted(boolean completed);
        List<Order> findByTitleContaining(String title);
        }
