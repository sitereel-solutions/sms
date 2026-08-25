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
public class MaintenanceCycleRequestDto {

    @NotBlank(message = "Month name is required (e.g. September 2026)")
    private String month;

    @NotBlank(message = "Billing cycle is required (e.g. 2026-09)")
    private String billingCycle;

    private Double baseMultiplier;
}
