package com.society.management.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpSendRequestDto {

    @NotBlank(message = "Phone number is required")
    private String phone;

    @Builder.Default
    private String purpose = "ADMIN_REGISTRATION"; // "ADMIN_REGISTRATION", "PASSWORD_RESET", "RESIDENT_REGISTRATION"
}
