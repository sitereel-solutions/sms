package com.society.management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments", indexes = {
        @Index(name = "idx_payment_receipt", columnList = "receiptNumber", unique = true),
        @Index(name = "idx_payment_flat", columnList = "flatNumber"),
        @Index(name = "idx_payment_date", columnList = "date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction {

    @Id
    private String id; // e.g. "pay-1"

    @Builder.Default
    private String societyId = "soc-grv";

    @Column(nullable = false)
    private String receiptNumber; // "REC-2026-00842"

    @Column(nullable = false)
    private String date; // "24 Aug 2026"

    @Column(nullable = false)
    private String timestamp;

    @Column(nullable = false)
    private String residentName;

    @Column(nullable = false)
    private String flatNumber;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String forMonth; // "August 2026 Maintenance"

    @Column(nullable = false)
    private String paymentMode; // "UPI", "Bank Transfer", "Cash", "Cheque", "Online"

    @Column(nullable = false)
    private String referenceId; // "UPI928374"

    private String chequeNumber;
    private String bankName;

    @Column(nullable = false)
    private String status; // "Success", "Pending", "Failed"

    private String notes;
}
