package com.society.management.service;

import com.society.management.entity.SocietySettings;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.repository.SocietySettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SocietySettingsService {

    private final SocietySettingsRepository societySettingsRepository;
    private final ActivityService activityService;

    @Transactional(readOnly = true)
    public SocietySettings getSettings() {
        return societySettingsRepository.findById(1L)
                .orElseThrow(() -> new ResourceNotFoundException("Society settings not found"));
    }

    @Transactional
    public SocietySettings updateSettings(SocietySettings settings) {
        settings.setId(1L);
        SocietySettings updated = societySettingsRepository.save(settings);
        activityService.logActivity(
                "Society Settings updated",
                "Configuration and maintenance rules saved",
                "maintenance",
                "text-purple-600 bg-purple-100"
        );
        return updated;
    }
}
