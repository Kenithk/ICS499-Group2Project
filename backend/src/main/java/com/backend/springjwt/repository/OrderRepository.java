package com.backend.springjwt.repository;

import java.util.*;

import org.springframework.data.jpa.repository.*;

import com.backend.springjwt.models.*;

public interface OrderRepository extends JpaRepository<Order, Long> {
        List<Order> findByCompleted(boolean completed);
        List<Order> findByTitleContaining(String title);
        List<Order> findByUserId(Long userId);
}
