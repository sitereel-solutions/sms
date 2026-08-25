package com.society.management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notices", indexes = {
        @Index(name = "idx_notice_category", columnList = "category"),
        @Index(name = "idx_notice_priority", columnList = "priority"),
        @Index(name = "idx_notice_pinned", columnList = "isPinned")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notice {

    @Id
    private String id; // e.g. "not-1"

    @Builder.Default
    private String societyId = "soc-grv";

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category; // "Maintenance", "Meeting", "Celebration", "Rules", "Emergency", "General"

    @Column(nullable = false)
    private String priority; // "Urgent", "High", "Normal"

    @Column(nullable = false)
    private String publishDate;

    @Column(nullable = false)
    private String validTill;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String publishedBy;

    @Column(nullable = false)
    private Boolean isPinned;

    private String attachmentName;
}
