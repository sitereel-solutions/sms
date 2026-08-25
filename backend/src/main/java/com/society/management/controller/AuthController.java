package com.society.management.controller;

import com.society.management.dto.*;
import com.society.management.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user login, OTP verification, registration, and password management")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user via email or phone and return JWT bearer token")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account (Admin or Resident)")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody RegisterRequestDto request) {
        return new ResponseEntity<>(authService.register(request), HttpStatus.CREATED);
    }

    @PostMapping("/otp/send")
    @Operation(summary = "Generate and send 6-digit OTP to mobile phone")
    public ResponseEntity<Map<String, Object>> sendOtp(@Valid @RequestBody OtpSendRequestDto request) {
        return ResponseEntity.ok(authService.sendOtp(request));
    }

    @PostMapping("/otp/verify")
    @Operation(summary = "Verify submitted OTP code against mobile phone")
    public ResponseEntity<Map<String, Object>> verifyOtp(@Valid @RequestBody OtpVerifyRequestDto request) {
        return ResponseEntity.ok(authService.verifyOtp(request));
    }

    @PostMapping("/reset-password-otp")
    @Operation(summary = "Reset account password using verified mobile OTP")
    public ResponseEntity<Map<String, Object>> resetPasswordWithOtp(@Valid @RequestBody OtpResetPasswordDto request) {
        return ResponseEntity.ok(authService.resetPasswordWithOtp(request));
    }

    @PostMapping("/register-resident")
    @Operation(summary = "Society Admin provisions a login account for a resident")
    public ResponseEntity<AuthResponseDto> registerResidentByAdmin(@Valid @RequestBody RegisterResidentRequestDto request) {
        return new ResponseEntity<>(authService.registerResidentByAdmin(request), HttpStatus.CREATED);
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password for the authenticated user")
    public ResponseEntity<Map<String, String>> changePassword(
            Principal principal,
            @Valid @RequestBody ChangePasswordRequestDto request
    ) {
        if (principal == null || principal.getName() == null) {
            throw new com.society.management.exception.BadRequestException("Authentication required to change password.");
        }
        authService.changePassword(principal.getName(), request);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}
