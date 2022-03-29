package com.backend.springjwt.repository;

import java.util.Optional;

import com.backend.springjwt.models.ERole;
import com.backend.springjwt.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByName(ERole name);
}
