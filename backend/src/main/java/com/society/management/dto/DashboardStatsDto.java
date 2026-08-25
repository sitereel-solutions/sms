package com.society.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalFlats;
    private long occupiedFlats;
    private long vacantFlats;
    private double occupancyRate;

    private long totalResidents;
    private double totalCollected;
    private double totalPending;
    private double totalExpenses;
    private double currentBalance;
    private double collectionRate;

    private long openComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;

    private long activeNotices;

    private Map<String, Double> expensesByCategory;
}
