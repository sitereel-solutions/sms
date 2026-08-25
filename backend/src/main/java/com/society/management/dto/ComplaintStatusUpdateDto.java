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
public class ComplaintStatusUpdateDto {

    @NotBlank(message = "Status is required")
    private String status; // "Open", "In Progress", "Resolved"

    private String note;
    private String assignedTo;
}
