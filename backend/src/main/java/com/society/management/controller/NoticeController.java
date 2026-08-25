package com.society.management.controller;

import com.society.management.dto.NoticeRequestDto;
import com.society.management.entity.Notice;
import com.society.management.service.NoticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@Tag(name = "Notices", description = "Endpoints for broadcasting and managing society notices")
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping
    @Operation(summary = "Get all notices (pinned first, descending publish date)")
    public ResponseEntity<List<Notice>> getAllNotices(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(noticeService.getNoticesByCategory(category));
        }
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get notice by ID")
    public ResponseEntity<Notice> getNoticeById(@PathVariable String id) {
        return ResponseEntity.ok(noticeService.getNoticeById(id));
    }

    @PostMapping
    @Operation(summary = "Publish a new notice")
    public ResponseEntity<Notice> createNotice(@Valid @RequestBody NoticeRequestDto request) {
        return new ResponseEntity<>(noticeService.createNotice(request), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/pin")
    @Operation(summary = "Toggle pinned status of a notice")
    public ResponseEntity<Notice> togglePin(@PathVariable String id) {
        return ResponseEntity.ok(noticeService.togglePin(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete notice")
    public ResponseEntity<Void> deleteNotice(@PathVariable String id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }
}
