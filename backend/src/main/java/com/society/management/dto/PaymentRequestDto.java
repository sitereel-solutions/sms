package com.society.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {

    @NotBlank(message = "Resident name is required")
    private String residentName;

    @NotBlank(message = "Flat number is required")
    private String flatNumber;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    @NotBlank(message = "For month description is required")
    private String forMonth;

    @NotBlank(message = "Payment mode is required")
    private String paymentMode;

    @NotBlank(message = "Reference ID is required")
    private String referenceId;

    private String date;
    private String chequeNumber;
    private String bankName;
    private String notes;
}
