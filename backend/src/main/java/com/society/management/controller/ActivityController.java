package com.society.management.controller;

import com.society.management.entity.ActivityItem;
import com.society.management.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@Tag(name = "Activities", description = "Endpoints for fetching society audit logs and recent activities")
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping
    @Operation(summary = "Get latest activity and audit logs")
    public ResponseEntity<List<ActivityItem>> getActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }
}
