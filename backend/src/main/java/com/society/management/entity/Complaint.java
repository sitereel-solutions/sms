package com.society.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "complaints", indexes = {
        @Index(name = "idx_complaint_ticket", columnList = "ticketNumber", unique = true),
        @Index(name = "idx_complaint_flat", columnList = "flatNumber"),
        @Index(name = "idx_complaint_status", columnList = "status"),
        @Index(name = "idx_complaint_priority", columnList = "priority")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    private String id; // e.g. "cmp-1"

    @Builder.Default
    private String societyId = "soc-grv";

    @Column(nullable = false)
    private String ticketNumber; // "#CMP-1024"

    @Column(nullable = false)
    private String residentName;

    @Column(nullable = false)
    private String flatNumber;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String category; // "Plumbing", "Electrical", "Lift", "Security", "Cleanliness", "Noise", "Carpentry", "Other"

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String date;

    @Column(nullable = false)
    private String priority; // "High", "Medium", "Low"

    @Column(nullable = false)
    private String status; // "Open", "In Progress", "Resolved"

    private String assignedTo;
    private String resolvedDate;

    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "complaint_timeline", joinColumns = @JoinColumn(name = "complaint_id"))
    @Builder.Default
    private List<ComplaintTimelineItem> timeline = new ArrayList<>();
}
