package com.society.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "societies", indexes = {
        @Index(name = "idx_society_subdomain", columnList = "subdomain", unique = true),
        @Index(name = "idx_society_status", columnList = "subscriptionStatus")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Society {

    @Id
    private String id; // e.g. "soc-grv"

    @Column(nullable = false)
    private String name; // "Green Valley Residency"

    @Column(unique = true)
    private String subdomain; // "greenvalley"

    private String registrationNumber;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String contactPhone;
    private String contactEmail;

    @Builder.Default
    private Integer totalFlats = 0;

    @Builder.Default
    private Integer totalBlocks = 0;

    // SaaS Subscription Details
    @Builder.Default
    private String subscriptionPlan = "GROWTH"; // "STARTER", "GROWTH", "ENTERPRISE", "TRIAL"

    @Builder.Default
    private String subscriptionStatus = "ACTIVE"; // "ACTIVE", "TRIAL", "PAST_DUE", "CANCELLED"

    @Builder.Default
    private Double monthlyCharge = 1999.0;

    private String planExpiresAt; // "2027-08-25"

    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    private String createdAt = LocalDateTime.now().toString();
}
