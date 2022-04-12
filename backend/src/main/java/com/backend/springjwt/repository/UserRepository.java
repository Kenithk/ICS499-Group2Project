package com.backend.springjwt.repository;

import java.util.*;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;

import com.backend.springjwt.models.*;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByUsernameContaining(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
