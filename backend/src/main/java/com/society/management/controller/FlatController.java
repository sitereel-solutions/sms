package com.society.management.controller;

import com.society.management.entity.Flat;
import com.society.management.service.FlatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flats")
@RequiredArgsConstructor
@Tag(name = "Flats", description = "Endpoints for managing society flats and units")
public class FlatController {

    private final FlatService flatService;

    @GetMapping
    @Operation(summary = "Get all flats or filter by block")
    public ResponseEntity<List<Flat>> getAllFlats(@RequestParam(required = false) String block) {
        if (block != null && !block.isBlank()) {
            return ResponseEntity.ok(flatService.getFlatsByBlock(block.toUpperCase()));
        }
        return ResponseEntity.ok(flatService.getAllFlats());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get flat by ID")
    public ResponseEntity<Flat> getFlatById(@PathVariable String id) {
        return ResponseEntity.ok(flatService.getFlatById(id));
    }

    @GetMapping("/number/{flatNumber}")
    @Operation(summary = "Get flat by flat number (e.g., A-101)")
    public ResponseEntity<Flat> getFlatByNumber(@PathVariable String flatNumber) {
        return ResponseEntity.ok(flatService.getFlatByFlatNumber(flatNumber));
    }

    @PostMapping
    @Operation(summary = "Create a new flat")
    public ResponseEntity<Flat> createFlat(@RequestBody Flat flat) {
        return new ResponseEntity<>(flatService.createFlat(flat), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update flat details")
    public ResponseEntity<Flat> updateFlat(@PathVariable String id, @RequestBody Flat flat) {
        return ResponseEntity.ok(flatService.updateFlat(id, flat));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete flat")
    public ResponseEntity<Void> deleteFlat(@PathVariable String id) {
        flatService.deleteFlat(id);
        return ResponseEntity.noContent().build();
    }
}
