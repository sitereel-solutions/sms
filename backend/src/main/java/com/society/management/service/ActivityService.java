package com.society.management.service;

import com.society.management.entity.ActivityItem;
import com.society.management.repository.ActivityRepository;
import com.society.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;

    @Transactional(readOnly = true)
    public List<ActivityItem> getAllActivities() {
        if (SecurityUtils.isSuperAdmin()) {
            return activityRepository.findTop50ByOrderByTimestampDesc();
        }
        String societyId = SecurityUtils.getCurrentSocietyId();
        return activityRepository.findTop50BySocietyIdOrderByTimestampDesc(societyId);
    }

    @Transactional
    public ActivityItem logActivity(String title, String subtitle, String type, String iconColor) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        ActivityItem activity = ActivityItem.builder()
                .id("act-" + (societyId != null ? societyId + "-" : "") + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4))
                .societyId(societyId)
                .title(title)
                .subtitle(subtitle)
                .timestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME))
                .timeAgo("Just now")
                .type(type)
                .iconColor(iconColor)
                .build();
        return activityRepository.save(activity);
    }
}
