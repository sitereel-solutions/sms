package com.society.management.repository;

import com.society.management.entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResidentRepository extends JpaRepository<Resident, String> {

    List<Resident> findBySocietyId(String societyId);

    Optional<Resident> findBySocietyIdAndFlatNumber(String societyId, String flatNumber);

    Optional<Resident> findByFlatNumber(String flatNumber);

    List<Resident> findBySocietyIdAndBlock(String societyId, String block);

    List<Resident> findByBlock(String block);

    List<Resident> findBySocietyIdAndStatus(String societyId, String status);

    List<Resident> findByStatus(String status);

    List<Resident> findBySocietyIdAndNameContainingIgnoreCase(String societyId, String name);

    List<Resident> findByNameContainingIgnoreCase(String name);

    long countBySocietyIdAndStatus(String societyId, String status);

    long countByStatus(String status);
}
