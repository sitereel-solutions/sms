package com.society.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {

    private String token;

    @Builder.Default
    private String type = "Bearer";

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role; // "ROLE_SUPER_ADMIN", "ROLE_ADMIN" or "ROLE_RESIDENT"
    private String societyId;
    private String societyName;
    private String subscriptionStatus;
    private String flatNumber;
    private String message;
}
