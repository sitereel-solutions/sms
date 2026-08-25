package com.society.management.repository;

import com.society.management.entity.SocietySettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SocietySettingsRepository extends JpaRepository<SocietySettings, Long> {
}
