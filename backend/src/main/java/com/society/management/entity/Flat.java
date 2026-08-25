package com.society.management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flats", indexes = {
        @Index(name = "idx_society_flat_number", columnList = "societyId, flatNumber", unique = true),
        @Index(name = "idx_flat_block", columnList = "block"),
        @Index(name = "idx_flat_occupancy", columnList = "occupancyStatus"),
        @Index(name = "idx_flat_maintenance", columnList = "maintenanceStatus")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flat {

    @Id
    private String id; // e.g. "flat-soc-grv-A-101"

    @Builder.Default
    private String societyId = "soc-grv";

    @Column(nullable = false)
    private String flatNumber; // e.g. "A-101"

    @Column(nullable = false)
    private String block; // "A" to "F"

    @Column(nullable = false)
    private Integer floor; // 1 to 5

    @Column(nullable = false)
    private String bhk; // "1 BHK", "2 BHK", "3 BHK", "4 BHK"

    @Column(nullable = false)
    private Integer areaSqFt;

    @Column(nullable = false)
    private String occupancyStatus; // "Occupied", "Vacant"

    @Column(nullable = false)
    private String ownershipType; // "Owner", "Tenant", "Vacant"

    private String residentName;
    private String residentPhone;
    private String residentEmail;

    @Column(nullable = false)
    private Double monthlyMaintenance;

    @Column(nullable = false)
    private String maintenanceStatus; // "Paid", "Pending", "Overdue"

    private String parkingSlot;
    private String electricityMeter;
    private String gasMeter;
}
