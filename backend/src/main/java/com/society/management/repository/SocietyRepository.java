package com.society.management.repository;

import com.society.management.entity.Society;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SocietyRepository extends JpaRepository<Society, String> {
    Optional<Society> findBySubdomain(String subdomain);
    boolean existsBySubdomain(String subdomain);
}
