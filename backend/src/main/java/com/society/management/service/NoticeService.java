package com.society.management.service;

import com.society.management.dto.NoticeRequestDto;
import com.society.management.entity.Notice;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.repository.NoticeRepository;
import com.society.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final ActivityService activityService;

    @Transactional(readOnly = true)
    public List<Notice> getAllNotices() {
        if (SecurityUtils.isSuperAdmin()) {
            return noticeRepository.findAllByOrderByIsPinnedDescPublishDateDesc();
        }
        String societyId = SecurityUtils.getCurrentSocietyId();
        return noticeRepository.findBySocietyIdOrderByIsPinnedDescPublishDateDesc(societyId);
    }

    @Transactional(readOnly = true)
    public Notice getNoticeById(String id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Notice> getNoticesByCategory(String category) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        return noticeRepository.findBySocietyIdAndCategory(societyId, category);
    }

    @Transactional
    public Notice createNotice(NoticeRequestDto dto) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        String noticeId = "not-" + (societyId != null ? societyId + "-" : "") + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4);
        Notice notice = Notice.builder()
                .id(noticeId)
                .societyId(societyId)
                .title(dto.getTitle())
                .category(dto.getCategory())
                .priority(dto.getPriority())
                .publishDate("24 Aug 2026")
                .validTill(dto.getValidTill())
                .content(dto.getContent())
                .publishedBy(dto.getPublishedBy())
                .isPinned(dto.getIsPinned() != null && dto.getIsPinned())
                .attachmentName(dto.getAttachmentName())
                .build();

        Notice saved = noticeRepository.save(notice);

        activityService.logActivity(
                "Notice: " + dto.getTitle(),
                dto.getPriority() + " Priority · Category: " + dto.getCategory(),
                "notice",
                "text-cyan-600 bg-cyan-100"
        );

        return saved;
    }

    @Transactional
    public Notice togglePin(String id) {
        Notice notice = getNoticeById(id);
        notice.setIsPinned(!notice.getIsPinned());
        return noticeRepository.save(notice);
    }

    @Transactional
    public void deleteNotice(String id) {
        Notice notice = getNoticeById(id);
        noticeRepository.delete(notice);
    }
}
