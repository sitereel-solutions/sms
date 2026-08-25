package com.society.management.service;

import com.society.management.dto.MaintenanceCycleRequestDto;
import com.society.management.entity.Flat;
import com.society.management.entity.MaintenanceRecord;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.repository.FlatRepository;
import com.society.management.repository.MaintenanceRecordRepository;
import com.society.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final FlatRepository flatRepository;
    private final ActivityService activityService;

    @Transactional(readOnly = true)
    public List<MaintenanceRecord> getAllRecords() {
        String societyId = SecurityUtils.getCurrentSocietyId();
        if (SecurityUtils.isResident()) {
            String flatNumber = SecurityUtils.getCurrentUserFlatNumber().orElse("A-101");
            return maintenanceRecordRepository.findBySocietyIdAndFlatNumber(societyId, flatNumber);
        }
        if (SecurityUtils.isSuperAdmin()) {
            return maintenanceRecordRepository.findAll();
        }
        return maintenanceRecordRepository.findBySocietyId(societyId);
    }

    @Transactional(readOnly = true)
    public List<MaintenanceRecord> getRecordsByFlatNumber(String flatNumber) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        return maintenanceRecordRepository.findBySocietyIdAndFlatNumber(societyId, flatNumber);
    }

    @Transactional(readOnly = true)
    public List<MaintenanceRecord> getRecordsByBillingCycle(String billingCycle) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        if (SecurityUtils.isResident()) {
            String flatNumber = SecurityUtils.getCurrentUserFlatNumber().orElse("A-101");
            return maintenanceRecordRepository.findBySocietyIdAndFlatNumber(societyId, flatNumber).stream()
                    .filter(r -> billingCycle.equalsIgnoreCase(r.getBillingCycle()))
                    .toList();
        }
        return maintenanceRecordRepository.findBySocietyIdAndBillingCycle(societyId, billingCycle);
    }

    @Transactional(readOnly = true)
    public MaintenanceRecord getRecordById(String id) {
        return maintenanceRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found with id: " + id));
    }

    @Transactional
    public List<MaintenanceRecord> generateCycle(MaintenanceCycleRequestDto request) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        List<Flat> occupiedFlats = flatRepository.findBySocietyIdAndOccupancyStatus(societyId, "Occupied");
        if (occupiedFlats.isEmpty()) {
            occupiedFlats = flatRepository.findByOccupancyStatus("Occupied");
        }
        List<MaintenanceRecord> createdRecords = new ArrayList<>();

        for (Flat flat : occupiedFlats) {
            String recordId = "maint-" + (flat.getSocietyId() != null ? flat.getSocietyId() + "-" : "") + request.getBillingCycle() + "-" + flat.getFlatNumber();

            // Skip if already exists
            if (maintenanceRecordRepository.existsById(recordId)) {
                continue;
            }

            double baseMaint = flat.getMonthlyMaintenance();
            double waterCharges = 350.0;
            double sinkingFund = Math.round(baseMaint * 0.10);
            double parkingCharges = 250.0;
            double baseAmount = baseMaint - waterCharges - sinkingFund - parkingCharges;
            String monthName = request.getMonth();
            String[] parts = monthName.split(" ");
            String dueDate = "10 " + (parts.length > 0 ? parts[0].substring(0, Math.min(3, parts[0].length())) : "Aug") + " " + (parts.length > 1 ? parts[1] : "2026");

            MaintenanceRecord record = MaintenanceRecord.builder()
                    .id(recordId)
                    .societyId(societyId)
                    .flatNumber(flat.getFlatNumber())
                    .residentName(flat.getResidentName() != null ? flat.getResidentName() : "Resident")
                    .month(request.getMonth())
                    .billingCycle(request.getBillingCycle())
                    .baseAmount(baseAmount)
                    .waterCharges(waterCharges)
                    .sinkingFund(sinkingFund)
                    .parkingCharges(parkingCharges)
                    .lateFee(0.0)
                    .totalAmount(baseMaint)
                    .paidAmount(0.0)
                    .balanceAmount(baseMaint)
                    .dueDate(dueDate)
                    .status("Pending")
                    .build();

            // Set flat status to Pending if it's currently Paid
            flat.setMaintenanceStatus("Pending");
            flatRepository.save(flat);

            createdRecords.add(maintenanceRecordRepository.save(record));
        }

        activityService.logActivity(
                "Maintenance cycle generated for " + request.getMonth(),
                occupiedFlats.size() + " occupied flats billed",
                "maintenance",
                "text-purple-600 bg-purple-100"
        );

        return createdRecords;
    }

    @Transactional
    public MaintenanceRecord updateRecordStatus(String id, String status) {
        MaintenanceRecord record = getRecordById(id);
        record.setStatus(status);
        if ("Paid".equalsIgnoreCase(status)) {
            record.setPaidAmount(record.getTotalAmount());
            record.setBalanceAmount(0.0);
        }
        return maintenanceRecordRepository.save(record);
    }
}
