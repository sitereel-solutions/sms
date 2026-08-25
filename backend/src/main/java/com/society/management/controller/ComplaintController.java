package com.society.management.controller;

import com.society.management.dto.ComplaintRequestDto;
import com.society.management.dto.ComplaintStatusUpdateDto;
import com.society.management.entity.Complaint;
import com.society.management.service.ComplaintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@Tag(name = "Complaints", description = "Endpoints for ticket registration, timeline, and complaint resolution")
public class ComplaintController {

    private final ComplaintService complaintService;

    @GetMapping
    @Operation(summary = "Get all complaints or filter by status / flat")
    public ResponseEntity<List<Complaint>> getAllComplaints(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String flatNumber) {
        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(complaintService.getComplaintsByStatus(status));
        }
        if (flatNumber != null && !flatNumber.isBlank()) {
            return ResponseEntity.ok(complaintService.getComplaintsByFlatNumber(flatNumber));
        }
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get complaint by ID")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable String id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @PostMapping
    @Operation(summary = "Register a new complaint")
    public ResponseEntity<Complaint> createComplaint(@Valid @RequestBody ComplaintRequestDto request) {
        return new ResponseEntity<>(complaintService.createComplaint(request), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update complaint status, assign staff, and append to timeline")
    public ResponseEntity<Complaint> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody ComplaintStatusUpdateDto request) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, request));
    }
}
