package com.society.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocietyDto {

    private String id;
    private String name;
    private String subdomain;
    private String registrationNumber;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String contactPhone;
    private String contactEmail;
    private Integer totalFlats;
    private Integer totalBlocks;

    // SaaS Subscription Details
    private String subscriptionPlan; // "STARTER", "GROWTH", "ENTERPRISE", "TRIAL"
    private String subscriptionStatus; // "ACTIVE", "TRIAL", "PAST_DUE", "CANCELLED"
    private Double monthlyCharge;
    private String planExpiresAt;
    private Boolean active;
    private String createdAt;

    // Admin Credentials for onboarding
    private String adminName;
    private String adminEmail;
    private String adminPassword;
    private String adminPhone;
    private String otp; // Mobile OTP for admin phone verification
}
