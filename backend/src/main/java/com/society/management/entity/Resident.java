package com.society.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "residents", indexes = {
        @Index(name = "idx_resident_flat", columnList = "flatNumber"),
        @Index(name = "idx_resident_status", columnList = "status"),
        @Index(name = "idx_resident_name", columnList = "name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resident {

    @Id
    private String id; // e.g. "res-1"

    @Builder.Default
    private String societyId = "soc-grv";

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String flatNumber;

    @Column(nullable = false)
    private String block;

    @Column(nullable = false)
    private String phone;

    private String alternatePhone;

    private String email;

    @Column(nullable = false)
    private String ownership; // "Owner", "Tenant"

    private Integer memberCount;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "resident_vehicles", joinColumns = @JoinColumn(name = "resident_id"))
    @Builder.Default
    private List<Vehicle> vehicles = new ArrayList<>();

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "emergency_contact_name")),
            @AttributeOverride(name = "phone", column = @Column(name = "emergency_contact_phone")),
            @AttributeOverride(name = "relation", column = @Column(name = "emergency_contact_relation"))
    })
    private EmergencyContact emergencyContact;

    private Double maintenanceAmount;

    @Column(nullable = false)
    private String status; // "Active", "Inactive"

    private String moveInDate;
    private String avatarColor;
}
