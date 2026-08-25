package com.society.management.controller;

import com.society.management.dto.MaintenanceCycleRequestDto;
import com.society.management.entity.MaintenanceRecord;
import com.society.management.service.MaintenanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
@Tag(name = "Maintenance", description = "Endpoints for maintenance billing cycles and records")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping
    @Operation(summary = "Get all maintenance records or filter by cycle / flat")
    public ResponseEntity<List<MaintenanceRecord>> getRecords(
            @RequestParam(required = false) String cycle,
            @RequestParam(required = false) String flatNumber) {
        if (cycle != null && !cycle.isBlank()) {
            return ResponseEntity.ok(maintenanceService.getRecordsByBillingCycle(cycle));
        }
        if (flatNumber != null && !flatNumber.isBlank()) {
            return ResponseEntity.ok(maintenanceService.getRecordsByFlatNumber(flatNumber));
        }
        return ResponseEntity.ok(maintenanceService.getAllRecords());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get maintenance record by ID")
    public ResponseEntity<MaintenanceRecord> getRecordById(@PathVariable String id) {
        return ResponseEntity.ok(maintenanceService.getRecordById(id));
    }

    @PostMapping("/generate-cycle")
    @Operation(summary = "Generate monthly maintenance billing records for all occupied flats")
    public ResponseEntity<List<MaintenanceRecord>> generateCycle(@Valid @RequestBody MaintenanceCycleRequestDto request) {
        return new ResponseEntity<>(maintenanceService.generateCycle(request), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update maintenance record status")
    public ResponseEntity<MaintenanceRecord> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(maintenanceService.updateRecordStatus(id, status));
    }
}
