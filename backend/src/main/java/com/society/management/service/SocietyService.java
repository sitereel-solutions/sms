package com.society.management.service;

import com.society.management.dto.SocietyDto;
import com.society.management.entity.*;
import com.society.management.exception.BadRequestException;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SocietyService {

    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;
    private final FlatRepository flatRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityService activityService;
    private final OtpService otpService;

    @Transactional(readOnly = true)
    public List<Society> getAllSocieties() {
        return societyRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Society getSocietyById(String id) {
        return societyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Society not found with id: " + id));
    }

    @Transactional
    public Society createSociety(SocietyDto dto) {
        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new BadRequestException("Society name is required");
        }

        String societyId = dto.getId();
        if (societyId == null || societyId.isBlank()) {
            String slug = dto.getName().toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-");
            societyId = "soc-" + slug;
        }

        if (societyRepository.existsById(societyId)) {
            societyId = societyId + "-" + System.currentTimeMillis() % 10000;
        }

        String subdomain = dto.getSubdomain();
        if (subdomain != null && !subdomain.isBlank() && societyRepository.existsBySubdomain(subdomain)) {
            throw new BadRequestException("Subdomain is already taken: " + subdomain);
        }

        // Verify Admin OTP if mobile number and OTP code are provided
        if (dto.getAdminPhone() != null && !dto.getAdminPhone().isBlank()) {
            if (dto.getOtp() != null && !dto.getOtp().isBlank()) {
                otpService.verifyOtp(dto.getAdminPhone(), dto.getOtp(), "ADMIN_REGISTRATION");
                otpService.consumeOtp(dto.getAdminPhone(), "ADMIN_REGISTRATION");
            } else if (!otpService.isOtpVerified(dto.getAdminPhone(), "ADMIN_REGISTRATION")) {
                // If not verified prior, throw error
                throw new BadRequestException("Admin mobile number (" + dto.getAdminPhone() + ") must be verified with OTP before registering society.");
            }
        }

        Society society = Society.builder()
                .id(societyId)
                .name(dto.getName())
                .subdomain(subdomain)
                .registrationNumber(dto.getRegistrationNumber())
                .address(dto.getAddress())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .contactPhone(dto.getContactPhone() != null ? dto.getContactPhone() : dto.getAdminPhone())
                .contactEmail(dto.getContactEmail() != null ? dto.getContactEmail() : dto.getAdminEmail())
                .totalFlats(dto.getTotalFlats() != null ? dto.getTotalFlats() : 0)
                .totalBlocks(dto.getTotalBlocks() != null ? dto.getTotalBlocks() : 0)
                .subscriptionPlan(dto.getSubscriptionPlan() != null ? dto.getSubscriptionPlan() : "GROWTH")
                .subscriptionStatus(dto.getSubscriptionStatus() != null ? dto.getSubscriptionStatus() : "ACTIVE")
                .monthlyCharge(dto.getMonthlyCharge() != null ? dto.getMonthlyCharge() : 1999.0)
                .planExpiresAt(dto.getPlanExpiresAt() != null ? dto.getPlanExpiresAt() : LocalDate.now().plusMonths(1).toString())
                .active(true)
                .createdAt(LocalDateTime.now().toString())
                .build();

        Society savedSociety = societyRepository.save(society);

        // If admin details provided, create society admin user
        if (dto.getAdminEmail() != null && !dto.getAdminEmail().isBlank()) {
            if (!userRepository.existsByEmail(dto.getAdminEmail())) {
                User adminUser = User.builder()
                        .name(dto.getAdminName() != null ? dto.getAdminName() : "Society Admin")
                        .email(dto.getAdminEmail())
                        .phone(dto.getAdminPhone())
                        .password(passwordEncoder.encode(dto.getAdminPassword() != null ? dto.getAdminPassword() : "admin123"))
                        .role(Role.ROLE_ADMIN)
                        .societyId(savedSociety.getId())
                        .active(true)
                        .build();
                userRepository.save(adminUser);
            }
        }

        activityService.logActivity(
                "New Society Onboarded: " + savedSociety.getName(),
                "Plan: " + savedSociety.getSubscriptionPlan() + " · ₹" + savedSociety.getMonthlyCharge() + "/mo",
                "society",
                "text-indigo-600 bg-indigo-100"
        );

        return savedSociety;
    }

    @Transactional
    public Society updateSociety(String id, SocietyDto dto) {
        Society society = getSocietyById(id);

        if (dto.getName() != null) society.setName(dto.getName());
        if (dto.getSubdomain() != null) society.setSubdomain(dto.getSubdomain());
        if (dto.getRegistrationNumber() != null) society.setRegistrationNumber(dto.getRegistrationNumber());
        if (dto.getAddress() != null) society.setAddress(dto.getAddress());
        if (dto.getCity() != null) society.setCity(dto.getCity());
        if (dto.getState() != null) society.setState(dto.getState());
        if (dto.getPincode() != null) society.setPincode(dto.getPincode());
        if (dto.getContactPhone() != null) society.setContactPhone(dto.getContactPhone());
        if (dto.getContactEmail() != null) society.setContactEmail(dto.getContactEmail());
        if (dto.getTotalFlats() != null) society.setTotalFlats(dto.getTotalFlats());
        if (dto.getTotalBlocks() != null) society.setTotalBlocks(dto.getTotalBlocks());
        if (dto.getSubscriptionPlan() != null) society.setSubscriptionPlan(dto.getSubscriptionPlan());
        if (dto.getSubscriptionStatus() != null) society.setSubscriptionStatus(dto.getSubscriptionStatus());
        if (dto.getMonthlyCharge() != null) society.setMonthlyCharge(dto.getMonthlyCharge());
        if (dto.getPlanExpiresAt() != null) society.setPlanExpiresAt(dto.getPlanExpiresAt());
        if (dto.getActive() != null) society.setActive(dto.getActive());

        return societyRepository.save(society);
    }

    @Transactional
    public void deleteSociety(String id) {
        Society society = getSocietyById(id);
        societyRepository.delete(society);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPlatformStats() {
        List<Society> all = societyRepository.findAll();
        long totalSocieties = all.size();
        long activeSubscriptions = all.stream().filter(s -> "ACTIVE".equalsIgnoreCase(s.getSubscriptionStatus())).count();
        long trialSubscriptions = all.stream().filter(s -> "TRIAL".equalsIgnoreCase(s.getSubscriptionStatus())).count();
        long overdueSubscriptions = all.stream().filter(s -> "PAST_DUE".equalsIgnoreCase(s.getSubscriptionStatus())).count();
        double mrr = all.stream()
                .filter(s -> "ACTIVE".equalsIgnoreCase(s.getSubscriptionStatus()))
                .mapToDouble(s -> s.getMonthlyCharge() != null ? s.getMonthlyCharge() : 0.0)
                .sum();
        long totalFlats = all.stream().mapToInt(s -> s.getTotalFlats() != null ? s.getTotalFlats() : 0).sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSocieties", totalSocieties);
        stats.put("activeSubscriptions", activeSubscriptions);
        stats.put("trialSubscriptions", trialSubscriptions);
        stats.put("overdueSubscriptions", overdueSubscriptions);
        stats.put("monthlyRecurringRevenue", mrr);
        stats.put("totalFlats", totalFlats);
        stats.put("totalUsers", userRepository.count());

        return stats;
    }
}
