package com.society.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "society_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocietySettings {

    @Id
    private Long id; // Singleton ID (e.g. 1L)

    @Column(nullable = false)
    private String name;

    private String subtitle;
    private String registrationNumber;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String contactPhone;
    private String contactEmail;
    private Integer totalFlats;
    private Integer totalBlocks;

    @Embedded
    private BankDetails bankDetails;

    @Embedded
    private MaintenanceConfig maintenanceConfig;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "society_committee_members", joinColumns = @JoinColumn(name = "settings_id"))
    @Builder.Default
    private List<CommitteeMember> committeeMembers = new ArrayList<>();
}
