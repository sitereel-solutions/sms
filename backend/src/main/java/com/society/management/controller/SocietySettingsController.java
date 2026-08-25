package com.society.management.controller;

import com.society.management.entity.SocietySettings;
import com.society.management.service.SocietySettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@Tag(name = "Settings", description = "Endpoints for society configuration, bank info, and committee members")
public class SocietySettingsController {

    private final SocietySettingsService societySettingsService;

    @GetMapping
    @Operation(summary = "Get society configuration and settings")
    public ResponseEntity<SocietySettings> getSettings() {
        return ResponseEntity.ok(societySettingsService.getSettings());
    }

    @PutMapping
    @Operation(summary = "Update society configuration and settings")
    public ResponseEntity<SocietySettings> updateSettings(@RequestBody SocietySettings settings) {
        return ResponseEntity.ok(societySettingsService.updateSettings(settings));
    }
}
