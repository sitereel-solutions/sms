package com.society.management.service;

import com.society.management.exception.BadRequestException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class OtpService {

    private static final long OTP_VALIDITY_SECONDS = 300; // 5 minutes
    private static final long VERIFIED_STATE_TTL_SECONDS = 600; // 10 minutes

    @Data
    @Builder
    @AllArgsConstructor
    private static class OtpRecord {
        private String phone;
        private String otp;
        private String purpose;
        private Instant expiresAt;
        private boolean verified;
        private Instant verifiedAt;
    }

    private final Map<String, OtpRecord> otpStore = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    private String getStoreKey(String phone, String purpose) {
        String cleanPhone = phone != null ? phone.replaceAll("[^0-9]", "") : "";
        String cleanPurpose = purpose != null ? purpose.trim().toUpperCase() : "GENERAL";
        return cleanPhone + ":" + cleanPurpose;
    }

    public Map<String, Object> sendOtp(String phone, String purpose) {
        if (phone == null || phone.isBlank()) {
            throw new BadRequestException("Phone number is required to send OTP.");
        }

        String key = getStoreKey(phone, purpose);
        // Generate 6-digit OTP
        int number = secureRandom.nextInt(900000) + 100000;
        String otp = String.valueOf(number);

        OtpRecord record = OtpRecord.builder()
                .phone(phone)
                .otp(otp)
                .purpose(purpose != null ? purpose.toUpperCase() : "GENERAL")
                .expiresAt(Instant.now().plusSeconds(OTP_VALIDITY_SECONDS))
                .verified(false)
                .build();

        otpStore.put(key, record);

        log.info("=================================================");
        log.info("📱 [SMS/OTP DISPATCH] Mobile: {} | OTP: {} | Purpose: {}", phone, otp, record.getPurpose());
        log.info("=================================================");

        return Map.of(
                "success", true,
                "phone", phone,
                "purpose", record.getPurpose(),
                "otp", otp, // Returned for dev/demo UI convenience
                "expiresInSeconds", OTP_VALIDITY_SECONDS,
                "message", "6-digit OTP sent successfully to " + phone
        );
    }

    public boolean verifyOtp(String phone, String otp, String purpose) {
        if (phone == null || otp == null) {
            throw new BadRequestException("Phone number and OTP are required.");
        }

        String key = getStoreKey(phone, purpose);
        OtpRecord record = otpStore.get(key);

        if (record == null) {
            throw new BadRequestException("No OTP requested for " + phone + ". Please request a new OTP.");
        }

        if (Instant.now().isAfter(record.getExpiresAt())) {
            otpStore.remove(key);
            throw new BadRequestException("OTP has expired. Please request a new OTP.");
        }

        if (!record.getOtp().equals(otp.trim())) {
            throw new BadRequestException("Invalid OTP code. Please check and try again.");
        }

        record.setVerified(true);
        record.setVerifiedAt(Instant.now());
        log.info("✅ OTP Verified successfully for mobile: {} (Purpose: {})", phone, record.getPurpose());
        return true;
    }

    public boolean isOtpVerified(String phone, String purpose) {
        String key = getStoreKey(phone, purpose);
        OtpRecord record = otpStore.get(key);
        if (record == null || !record.isVerified() || record.getVerifiedAt() == null) {
            return false;
        }
        return Instant.now().isBefore(record.getVerifiedAt().plusSeconds(VERIFIED_STATE_TTL_SECONDS));
    }

    public void consumeOtp(String phone, String purpose) {
        String key = getStoreKey(phone, purpose);
        otpStore.remove(key);
    }
}
