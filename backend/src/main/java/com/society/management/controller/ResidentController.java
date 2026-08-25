package com.society.management.controller;

import com.society.management.entity.Resident;
import com.society.management.service.ResidentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/residents")
@RequiredArgsConstructor
@Tag(name = "Residents", description = "Endpoints for managing society residents and occupants")
public class ResidentController {

    private final ResidentService residentService;

    @GetMapping
    @Operation(summary = "Get all residents")
    public ResponseEntity<List<Resident>> getAllResidents() {
        return ResponseEntity.ok(residentService.getAllResidents());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get resident by ID")
    public ResponseEntity<Resident> getResidentById(@PathVariable String id) {
        return ResponseEntity.ok(residentService.getResidentById(id));
    }

    @GetMapping("/flat/{flatNumber}")
    @Operation(summary = "Get resident by flat number")
    public ResponseEntity<Resident> getResidentByFlatNumber(@PathVariable String flatNumber) {
        return ResponseEntity.ok(residentService.getResidentByFlatNumber(flatNumber));
    }

    @PostMapping
    @Operation(summary = "Add a new resident")
    public ResponseEntity<Resident> createResident(@RequestBody Resident resident) {
        return new ResponseEntity<>(residentService.createResident(resident), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update resident details")
    public ResponseEntity<Resident> updateResident(@PathVariable String id, @RequestBody Resident resident) {
        return ResponseEntity.ok(residentService.updateResident(id, resident));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete resident")
    public ResponseEntity<Void> deleteResident(@PathVariable String id) {
        residentService.deleteResident(id);
        return ResponseEntity.noContent().build();
    }
}
