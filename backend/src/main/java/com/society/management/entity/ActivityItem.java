package com.society.management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "activities", indexes = {
        @Index(name = "idx_activity_timestamp", columnList = "timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityItem {

    @Id
    private String id; // e.g. "act-12345"

    @Builder.Default
    private String societyId = "soc-grv";

    private String title;
    private String subtitle;
    private String timestamp;
    private String timeAgo;
    private String type; // "payment", "expense", "resident", "maintenance", "complaint", "notice"
    private String iconColor;
}
