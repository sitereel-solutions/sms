package com.society.management.repository;

import com.society.management.entity.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, String> {

    List<MaintenanceRecord> findBySocietyId(String societyId);

    List<MaintenanceRecord> findBySocietyIdAndFlatNumber(String societyId, String flatNumber);

    List<MaintenanceRecord> findByFlatNumber(String flatNumber);

    List<MaintenanceRecord> findBySocietyIdAndBillingCycle(String societyId, String billingCycle);

    List<MaintenanceRecord> findByBillingCycle(String billingCycle);

    List<MaintenanceRecord> findBySocietyIdAndStatus(String societyId, String status);

    List<MaintenanceRecord> findByStatus(String status);

    Optional<MaintenanceRecord> findBySocietyIdAndFlatNumberAndBillingCycle(String societyId, String flatNumber, String billingCycle);

    Optional<MaintenanceRecord> findByFlatNumberAndBillingCycle(String flatNumber, String billingCycle);

    @Query("SELECT SUM(m.totalAmount) FROM MaintenanceRecord m WHERE m.societyId = :societyId AND m.billingCycle = :billingCycle")
    Double sumTotalAmountBySocietyIdAndBillingCycle(@Param("societyId") String societyId, @Param("billingCycle") String billingCycle);

    @Query("SELECT SUM(m.totalAmount) FROM MaintenanceRecord m WHERE m.billingCycle = :billingCycle")
    Double sumTotalAmountByBillingCycle(String billingCycle);

    @Query("SELECT SUM(m.paidAmount) FROM MaintenanceRecord m WHERE m.societyId = :societyId AND m.billingCycle = :billingCycle")
    Double sumPaidAmountBySocietyIdAndBillingCycle(@Param("societyId") String societyId, @Param("billingCycle") String billingCycle);

    @Query("SELECT SUM(m.paidAmount) FROM MaintenanceRecord m WHERE m.billingCycle = :billingCycle")
    Double sumPaidAmountByBillingCycle(String billingCycle);

    @Query("SELECT SUM(m.balanceAmount) FROM MaintenanceRecord m WHERE m.societyId = :societyId")
    Double sumTotalPendingAmountBySocietyId(@Param("societyId") String societyId);

    @Query("SELECT SUM(m.balanceAmount) FROM MaintenanceRecord m")
    Double sumTotalPendingAmount();

    @Query("SELECT DISTINCT m.billingCycle FROM MaintenanceRecord m WHERE m.societyId = :societyId ORDER BY m.billingCycle DESC")
    List<String> findDistinctBillingCyclesBySocietyId(@Param("societyId") String societyId);

    @Query("SELECT DISTINCT m.billingCycle FROM MaintenanceRecord m ORDER BY m.billingCycle DESC")
    List<String> findDistinctBillingCycles();
}
