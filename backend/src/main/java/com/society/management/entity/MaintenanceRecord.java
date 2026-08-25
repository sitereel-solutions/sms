package com.society.management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "maintenance_records", indexes = {
        @Index(name = "idx_maint_flat", columnList = "flatNumber"),
        @Index(name = "idx_maint_cycle", columnList = "billingCycle"),
        @Index(name = "idx_maint_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRecord {

    @Id
    private String id; // e.g. "maint-2026-08-A-101"

    @Builder.Default
    private String societyId = "soc-grv";

    @Column(nullable = false)
    private String flatNumber;

    @Column(nullable = false)
    private String residentName;

    @Column(nullable = false)
    private String month; // e.g. "August 2026"

    @Column(nullable = false)
    private String billingCycle; // "2026-08"

    @Column(nullable = false)
    private Double baseAmount;

    @Column(nullable = false)
    private Double waterCharges;

    @Column(nullable = false)
    private Double sinkingFund;

    @Column(nullable = false)
    private Double parkingCharges;

    @Column(nullable = false)
    private Double lateFee;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private Double paidAmount;

    @Column(nullable = false)
    private Double balanceAmount;

    @Column(nullable = false)
    private String dueDate; // e.g. "10 Aug 2026"

    @Column(nullable = false)
    private String status; // "Paid", "Pending", "Overdue"

    private String paidDate;
    private String paymentReceiptId;
}
