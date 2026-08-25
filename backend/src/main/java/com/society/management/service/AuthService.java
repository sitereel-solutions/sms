package com.society.management.service;

import com.society.management.dto.*;
import com.society.management.entity.Role;
import com.society.management.entity.User;
import com.society.management.exception.BadRequestException;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.repository.SocietyRepository;
import com.society.management.repository.UserRepository;
import com.society.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SocietyRepository societyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ActivityService activityService;
    private final OtpService otpService;

    @Transactional
    public AuthResponseDto register(RegisterRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists.");
        }

        Role userRole = Role.ROLE_RESIDENT;
        if (request.getRole() != null) {
            if ("ROLE_SUPER_ADMIN".equalsIgnoreCase(request.getRole())) {
                userRole = Role.ROLE_SUPER_ADMIN;
            } else if ("ROLE_ADMIN".equalsIgnoreCase(request.getRole())) {
                userRole = Role.ROLE_ADMIN;
            }
        }

        String societyId = "soc-grv";
        String societyName = "Green Valley Residency";
        String subscriptionStatus = "ACTIVE";

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .societyId(societyId)
                .flatNumber(request.getFlatNumber())
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", savedUser.getRole().name());
        claims.put("name", savedUser.getName());
        claims.put("flatNumber", savedUser.getFlatNumber());
        claims.put("phone", savedUser.getPhone());
        claims.put("societyId", societyId);
        claims.put("societyName", societyName);
        claims.put("subscriptionStatus", subscriptionStatus);

        String jwtToken = jwtService.generateToken(claims, savedUser);

        activityService.logActivity(
                "New account registered: " + savedUser.getName(),
                "Role: " + savedUser.getRole().name() + (savedUser.getFlatNumber() != null ? " · Flat " + savedUser.getFlatNumber() : ""),
                "resident",
                "text-blue-600 bg-blue-100"
        );

        return AuthResponseDto.builder()
                .token(jwtToken)
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .role(savedUser.getRole().name())
                .societyId(societyId)
                .societyName(societyName)
                .subscriptionStatus(subscriptionStatus)
                .flatNumber(savedUser.getFlatNumber())
                .message("User registered successfully")
                .build();
    }

    public AuthResponseDto login(LoginRequestDto request) {
        String loginIdentifier = request.getEmail().trim();
        String userEmail = loginIdentifier.toLowerCase();

        // Check if identifier is phone number
        if (!loginIdentifier.contains("@")) {
            Optional<User> userByPhone = userRepository.findByPhone(loginIdentifier);
            if (userByPhone.isPresent()) {
                userEmail = userByPhone.get().getEmail();
            }
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userEmail,
                        request.getPassword()
                )
        );

        User user = (User) authentication.getPrincipal();

        String societyId = user.getSocietyId() != null ? user.getSocietyId() : "soc-grv";
        String societyName = "Green Valley Residency";
        String subscriptionStatus = "ACTIVE";

        if (user.getRole() == Role.ROLE_SUPER_ADMIN) {
            societyName = "SaaS Platform Management";
            societyId = "platform-root";
        } else {
            Optional<com.society.management.entity.Society> socOpt = societyRepository.findById(societyId);
            if (socOpt.isPresent()) {
                societyName = socOpt.get().getName();
                subscriptionStatus = socOpt.get().getSubscriptionStatus();
            }
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("name", user.getName());
        claims.put("flatNumber", user.getFlatNumber());
        claims.put("phone", user.getPhone());
        claims.put("societyId", societyId);
        claims.put("societyName", societyName);
        claims.put("subscriptionStatus", subscriptionStatus);

        String jwtToken = jwtService.generateToken(claims, user);

        activityService.logActivity(
                user.getName() + " signed in",
                "Role: " + user.getRole().name() + " · " + societyName,
                "resident",
                "text-emerald-600 bg-emerald-100"
        );

        return AuthResponseDto.builder()
                .token(jwtToken)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .societyId(societyId)
                .societyName(societyName)
                .subscriptionStatus(subscriptionStatus)
                .flatNumber(user.getFlatNumber())
                .message("Login successful")
                .build();
    }

    public Map<String, Object> sendOtp(OtpSendRequestDto dto) {
        return otpService.sendOtp(dto.getPhone(), dto.getPurpose());
    }

    public Map<String, Object> verifyOtp(OtpVerifyRequestDto dto) {
        boolean valid = otpService.verifyOtp(dto.getPhone(), dto.getOtp(), dto.getPurpose());
        return Map.of("success", valid, "message", "OTP verified successfully", "phone", dto.getPhone());
    }

    @Transactional
    public Map<String, Object> resetPasswordWithOtp(OtpResetPasswordDto dto) {
        String identifier = dto.getIdentifier().trim();
        User user = null;

        if (identifier.contains("@")) {
            user = userRepository.findByEmail(identifier.toLowerCase())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + identifier));
        } else {
            user = userRepository.findByPhone(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with mobile number: " + identifier));
        }

        String phoneToVerify = user.getPhone() != null ? user.getPhone() : identifier;
        otpService.verifyOtp(phoneToVerify, dto.getOtp(), "PASSWORD_RESET");

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
        otpService.consumeOtp(phoneToVerify, "PASSWORD_RESET");

        activityService.logActivity(
                user.getName() + " reset password via Mobile OTP",
                "Password updated successfully",
                "resident",
                "text-indigo-600 bg-indigo-100"
        );

        return Map.of("success", true, "message", "Password reset successfully. You can now login with your new password.");
    }

    @Transactional
    public AuthResponseDto registerResidentByAdmin(RegisterResidentRequestDto request) {
        String adminSocietyId = SecurityUtils.getCurrentSocietyId();

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists.");
        }

        User residentUser = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_RESIDENT)
                .societyId(adminSocietyId)
                .flatNumber(request.getFlatNumber())
                .active(true)
                .build();

        User saved = userRepository.save(residentUser);

        activityService.logActivity(
                "Resident user provisioned: " + saved.getName(),
                "Flat " + saved.getFlatNumber() + " · Mobile: " + saved.getPhone(),
                "resident",
                "text-emerald-600 bg-emerald-100"
        );

        return AuthResponseDto.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .phone(saved.getPhone())
                .role(saved.getRole().name())
                .societyId(saved.getSocietyId())
                .flatNumber(saved.getFlatNumber())
                .message("Resident login account created successfully")
                .build();
    }

    @Transactional
    public void changePassword(String userEmail, com.society.management.dto.ChangePasswordRequestDto request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match our records.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        activityService.logActivity(
                user.getName() + " changed password",
                "Account password updated successfully",
                "resident",
                "text-indigo-600 bg-indigo-100"
        );
    }
}
