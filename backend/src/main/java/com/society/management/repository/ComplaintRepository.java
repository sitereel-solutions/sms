package com.society.management.repository;

import com.society.management.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, String> {

    List<Complaint> findBySocietyId(String societyId);

    List<Complaint> findBySocietyIdAndFlatNumber(String societyId, String flatNumber);

    List<Complaint> findBySocietyIdAndStatus(String societyId, String status);

    List<Complaint> findBySocietyIdAndCategory(String societyId, String category);

    Optional<Complaint> findByTicketNumber(String ticketNumber);

    List<Complaint> findByFlatNumber(String flatNumber);

    List<Complaint> findByStatus(String status);

    List<Complaint> findByCategory(String category);

    List<Complaint> findByPriority(String priority);

    long countBySocietyIdAndStatus(String societyId, String status);

    long countByStatus(String status);
}
