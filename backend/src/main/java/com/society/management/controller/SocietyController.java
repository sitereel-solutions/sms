package com.society.management.controller;

import com.society.management.dto.SocietyDto;
import com.society.management.entity.Society;
import com.society.management.service.SocietyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/societies")
@RequiredArgsConstructor
@Tag(name = "Societies", description = "Multi-tenant SaaS Society management and subscription endpoints")
public class SocietyController {

    private final SocietyService societyService;

    @GetMapping
    @Operation(summary = "Get all registered societies")
    public ResponseEntity<List<Society>> getAllSocieties() {
        return ResponseEntity.ok(societyService.getAllSocieties());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get society by ID")
    public ResponseEntity<Society> getSocietyById(@PathVariable String id) {
        return ResponseEntity.ok(societyService.getSocietyById(id));
    }

    @GetMapping("/platform/stats")
    @Operation(summary = "Get SaaS platform overview metrics and MRR")
    public ResponseEntity<Map<String, Object>> getPlatformStats() {
        return ResponseEntity.ok(societyService.getPlatformStats());
    }

    @PostMapping
    @Operation(summary = "Onboard a new society with subscription plan")
    public ResponseEntity<Society> createSociety(@RequestBody SocietyDto dto) {
        return new ResponseEntity<>(societyService.createSociety(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update society details or subscription")
    public ResponseEntity<Society> updateSociety(@PathVariable String id, @RequestBody SocietyDto dto) {
        return ResponseEntity.ok(societyService.updateSociety(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete society")
    public ResponseEntity<Void> deleteSociety(@PathVariable String id) {
        societyService.deleteSociety(id);
        return ResponseEntity.noContent().build();
    }
}
