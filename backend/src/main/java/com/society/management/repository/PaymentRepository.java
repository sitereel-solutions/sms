package com.society.management.repository;

import com.society.management.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentTransaction, String> {

    List<PaymentTransaction> findBySocietyIdOrderByTimestampDesc(String societyId);

    List<PaymentTransaction> findBySocietyIdAndFlatNumberOrderByTimestampDesc(String societyId, String flatNumber);

    Optional<PaymentTransaction> findByReceiptNumber(String receiptNumber);

    List<PaymentTransaction> findByFlatNumberOrderByTimestampDesc(String flatNumber);

    List<PaymentTransaction> findAllByOrderByTimestampDesc();

    @Query("SELECT SUM(p.amount) FROM PaymentTransaction p WHERE p.societyId = :societyId AND p.status = 'Success'")
    Double sumTotalCollectedBySocietyId(@Param("societyId") String societyId);

    @Query("SELECT SUM(p.amount) FROM PaymentTransaction p WHERE p.status = 'Success'")
    Double sumTotalCollected();
}
