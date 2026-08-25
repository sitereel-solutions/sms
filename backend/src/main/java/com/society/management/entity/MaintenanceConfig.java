package com.society.management.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceConfig {
    private Double defaultFlatRate;
    private Double sqFtRate;
    private Integer billingDayOfMonth;
    private Integer dueDayOfMonth;
    private Double lateFeePerWeek;
    private Double waterChargePerFlat;
    private Double sinkingFundPercentage;
}
