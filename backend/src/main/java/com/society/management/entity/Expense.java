package com.society.management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "expenses", indexes = {
        @Index(name = "idx_expense_category", columnList = "category"),
        @Index(name = "idx_expense_date", columnList = "date"),
        @Index(name = "idx_expense_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    private String id; // e.g. "exp-1"

    @Builder.Default
    private String societyId = "soc-grv";

    @Column(nullable = false)
    private String date; // "24 Aug 2026"

    @Column(nullable = false)
    private String category; // "Electricity", "Security", "Housekeeping", "Lift", "Water", "Gardening", "Repairs", "AMC", "Salary", "Other"

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String vendor;

    private String vendorContact;

    @Column(nullable = false)
    private String invoiceNumber;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String paymentMode; // "UPI", "Bank Transfer", "Cash", "Cheque", "Online"

    @Column(nullable = false)
    private String status; // "Paid", "Pending", "Approved"

    @Column(nullable = false)
    private String approvedBy;

    private String notes;
}
