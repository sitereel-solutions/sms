package com.society.management.service;

import com.society.management.dto.ComplaintRequestDto;
import com.society.management.dto.ComplaintStatusUpdateDto;
import com.society.management.entity.Complaint;
import com.society.management.entity.ComplaintTimelineItem;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.repository.ComplaintRepository;
import com.society.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ActivityService activityService;

    @Transactional(readOnly = true)
    public List<Complaint> getAllComplaints() {
        String societyId = SecurityUtils.getCurrentSocietyId();
        if (SecurityUtils.isResident()) {
            String flatNumber = SecurityUtils.getCurrentUserFlatNumber().orElse("A-101");
            return complaintRepository.findBySocietyIdAndFlatNumber(societyId, flatNumber);
        }
        if (SecurityUtils.isSuperAdmin()) {
            return complaintRepository.findAll();
        }
        return complaintRepository.findBySocietyId(societyId);
    }

    @Transactional(readOnly = true)
    public Complaint getComplaintById(String id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Complaint> getComplaintsByFlatNumber(String flatNumber) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        return complaintRepository.findBySocietyIdAndFlatNumber(societyId, flatNumber);
    }

    @Transactional(readOnly = true)
    public List<Complaint> getComplaintsByStatus(String status) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        if (SecurityUtils.isResident()) {
            String flatNumber = SecurityUtils.getCurrentUserFlatNumber().orElse("A-101");
            return complaintRepository.findBySocietyIdAndFlatNumber(societyId, flatNumber).stream()
                    .filter(c -> status.equalsIgnoreCase(c.getStatus()))
                    .toList();
        }
        return complaintRepository.findBySocietyIdAndStatus(societyId, status);
    }

    @Transactional
    public Complaint createComplaint(ComplaintRequestDto dto) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        long count = complaintRepository.count();
        String ticketNumber = "#CMP-" + (1025 + count);
        String complaintId = "cmp-" + (societyId != null ? societyId + "-" : "") + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4);

        List<ComplaintTimelineItem> timeline = new ArrayList<>();
        timeline.add(ComplaintTimelineItem.builder()
                .date("24 Aug 2026 " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")))
                .status("Open")
                .note("Complaint registered by " + dto.getResidentName())
                .build());

        Complaint complaint = Complaint.builder()
                .id(complaintId)
                .societyId(societyId)
                .ticketNumber(ticketNumber)
                .residentName(dto.getResidentName())
                .flatNumber(dto.getFlatNumber())
                .phone(dto.getPhone())
                .category(dto.getCategory())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .date("24 Aug 2026")
                .priority(dto.getPriority())
                .status("Open")
                .timeline(timeline)
                .build();

        Complaint saved = complaintRepository.save(complaint);

        activityService.logActivity(
                "Complaint " + ticketNumber + " logged",
                "Flat " + dto.getFlatNumber() + " · " + dto.getTitle(),
                "complaint",
                "text-rose-600 bg-rose-100"
        );

        return saved;
    }

    @Transactional
    public Complaint updateComplaintStatus(String id, ComplaintStatusUpdateDto dto) {
        Complaint complaint = getComplaintById(id);
        complaint.setStatus(dto.getStatus());

        if ("Resolved".equalsIgnoreCase(dto.getStatus())) {
            complaint.setResolvedDate("24 Aug 2026");
            complaint.setResolutionNotes(dto.getNote());
        }

        if (dto.getAssignedTo() != null && !dto.getAssignedTo().isBlank()) {
            complaint.setAssignedTo(dto.getAssignedTo());
        }

        String note = dto.getNote() != null && !dto.getNote().isBlank()
                ? dto.getNote()
                : "Status updated to " + dto.getStatus();

        complaint.getTimeline().add(ComplaintTimelineItem.builder()
                .date("24 Aug 2026 " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")))
                .status(dto.getStatus())
                .note(note)
                .build());

        return complaintRepository.save(complaint);
    }
}
