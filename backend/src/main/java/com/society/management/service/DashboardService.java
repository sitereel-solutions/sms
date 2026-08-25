package com.society.management.service;

import com.society.management.dto.DashboardStatsDto;
import com.society.management.repository.*;
import com.society.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FlatRepository flatRepository;
    private final ResidentRepository residentRepository;
    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final PaymentRepository paymentRepository;
    private final ExpenseRepository expenseRepository;
    private final NoticeRepository noticeRepository;
    private final ComplaintRepository complaintRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        String societyId = SecurityUtils.getCurrentSocietyId();

        long totalFlats = flatRepository.countBySocietyId(societyId);
        if (totalFlats == 0 && SecurityUtils.isSuperAdmin()) {
            totalFlats = flatRepository.count();
        }
        long occupiedFlats = flatRepository.countBySocietyIdAndOccupancyStatus(societyId, "Occupied");
        long vacantFlats = Math.max(0, totalFlats - occupiedFlats);
        double occupancyRate = totalFlats > 0 ? ((double) occupiedFlats / totalFlats) * 100.0 : 0.0;

        long totalResidents = residentRepository.countBySocietyIdAndStatus(societyId, "Active");
        Double totalCollected = paymentRepository.sumTotalCollectedBySocietyId(societyId);
        if (totalCollected == null) totalCollected = 0.0;

        Double totalPending = maintenanceRecordRepository.sumTotalPendingAmountBySocietyId(societyId);
        if (totalPending == null) totalPending = 0.0;

        Double totalExpenses = expenseRepository.sumTotalExpensesBySocietyId(societyId);
        if (totalExpenses == null) totalExpenses = 0.0;

        double currentBalance = totalCollected - totalExpenses;
        double totalBilled = totalCollected + totalPending;
        double collectionRate = totalBilled > 0 ? (totalCollected / totalBilled) * 100.0 : 0.0;

        long openComplaints = complaintRepository.countBySocietyIdAndStatus(societyId, "Open");
        long inProgressComplaints = complaintRepository.countBySocietyIdAndStatus(societyId, "In Progress");
        long resolvedComplaints = complaintRepository.countBySocietyIdAndStatus(societyId, "Resolved");

        long activeNotices = noticeRepository.count();

        List<Object[]> categorySums = expenseRepository.sumExpensesByCategoryAndSocietyId(societyId);
        Map<String, Double> expensesByCategory = new HashMap<>();
        for (Object[] row : categorySums) {
            String category = (String) row[0];
            Double sum = (Double) row[1];
            expensesByCategory.put(category, sum);
        }

        return DashboardStatsDto.builder()
                .totalFlats(totalFlats)
                .occupiedFlats(occupiedFlats)
                .vacantFlats(vacantFlats)
                .occupancyRate(Math.round(occupancyRate * 10.0) / 10.0)
                .totalResidents(totalResidents)
                .totalCollected(totalCollected)
                .totalPending(totalPending)
                .totalExpenses(totalExpenses)
                .currentBalance(currentBalance)
                .collectionRate(Math.round(collectionRate * 10.0) / 10.0)
                .openComplaints(openComplaints)
                .inProgressComplaints(inProgressComplaints)
                .resolvedComplaints(resolvedComplaints)
                .activeNotices(activeNotices)
                .expensesByCategory(expensesByCategory)
                .build();
    }
}
