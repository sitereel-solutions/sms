package com.society.management.repository;

import com.society.management.entity.Flat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlatRepository extends JpaRepository<Flat, String> {

    List<Flat> findBySocietyId(String societyId);

    Optional<Flat> findBySocietyIdAndFlatNumber(String societyId, String flatNumber);

    Optional<Flat> findByFlatNumber(String flatNumber);

    List<Flat> findBySocietyIdAndBlock(String societyId, String block);

    List<Flat> findByBlock(String block);

    List<Flat> findBySocietyIdAndOccupancyStatus(String societyId, String occupancyStatus);

    List<Flat> findByOccupancyStatus(String occupancyStatus);

    List<Flat> findBySocietyIdAndMaintenanceStatus(String societyId, String maintenanceStatus);

    List<Flat> findByMaintenanceStatus(String maintenanceStatus);

    long countBySocietyId(String societyId);

    long countBySocietyIdAndOccupancyStatus(String societyId, String occupancyStatus);

    long countByOccupancyStatus(String occupancyStatus);

    long countBySocietyIdAndMaintenanceStatus(String societyId, String maintenanceStatus);

    long countByMaintenanceStatus(String maintenanceStatus);

    @Query("SELECT DISTINCT f.block FROM Flat f WHERE f.societyId = :societyId ORDER BY f.block")
    List<String> findDistinctBlocksBySocietyId(@Param("societyId") String societyId);

    @Query("SELECT DISTINCT f.block FROM Flat f ORDER BY f.block")
    List<String> findDistinctBlocks();
}
