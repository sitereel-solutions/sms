package com.society.management.service;

import com.society.management.dto.PaymentRequestDto;
import com.society.management.entity.Flat;
import com.society.management.entity.MaintenanceRecord;
import com.society.management.entity.PaymentTransaction;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.repository.FlatRepository;
import com.society.management.repository.MaintenanceRecordRepository;
import com.society.management.repository.PaymentRepository;
import com.society.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final FlatRepository flatRepository;
    private final ActivityService activityService;

    @Transactional(readOnly = true)
    public List<PaymentTransaction> getAllPayments() {
        String societyId = SecurityUtils.getCurrentSocietyId();
        if (SecurityUtils.isResident()) {
            String flatNumber = SecurityUtils.getCurrentUserFlatNumber().orElse("A-101");
            return paymentRepository.findBySocietyIdAndFlatNumberOrderByTimestampDesc(societyId, flatNumber);
        }
        if (SecurityUtils.isSuperAdmin()) {
            return paymentRepository.findAllByOrderByTimestampDesc();
        }
        return paymentRepository.findBySocietyIdOrderByTimestampDesc(societyId);
    }

    @Transactional(readOnly = true)
    public PaymentTransaction getPaymentById(String id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment transaction not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public PaymentTransaction getPaymentByReceiptNumber(String receiptNumber) {
        return paymentRepository.findByReceiptNumber(receiptNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with receipt number: " + receiptNumber));
    }

    @Transactional(readOnly = true)
    public List<PaymentTransaction> getPaymentsByFlatNumber(String flatNumber) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        return paymentRepository.findBySocietyIdAndFlatNumberOrderByTimestampDesc(societyId, flatNumber);
    }

    @Transactional
    public PaymentTransaction recordPayment(PaymentRequestDto dto) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        long count = paymentRepository.count();
        String receiptNumber = "REC-2026-00" + (843 + count);
        String paymentId = "pay-" + (societyId != null ? societyId + "-" : "") + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4);
        String paymentDate = dto.getDate() != null && !dto.getDate().isBlank() ? dto.getDate() : "24 Aug 2026";

        PaymentTransaction payment = PaymentTransaction.builder()
                .id(paymentId)
                .societyId(societyId)
                .receiptNumber(receiptNumber)
                .date(paymentDate)
                .timestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME))
                .residentName(dto.getResidentName())
                .flatNumber(dto.getFlatNumber())
                .amount(dto.getAmount())
                .forMonth(dto.getForMonth())
                .paymentMode(dto.getPaymentMode())
                .referenceId(dto.getReferenceId())
                .chequeNumber(dto.getChequeNumber())
                .bankName(dto.getBankName())
                .status("Success")
                .notes(dto.getNotes())
                .build();

        PaymentTransaction savedPayment = paymentRepository.save(payment);

        // Update corresponding MaintenanceRecord for this flat if pending/overdue
        List<MaintenanceRecord> flatRecords = maintenanceRecordRepository.findBySocietyIdAndFlatNumber(societyId, dto.getFlatNumber());
        if (flatRecords.isEmpty()) {
            flatRecords = maintenanceRecordRepository.findByFlatNumber(dto.getFlatNumber());
        }
        for (MaintenanceRecord rec : flatRecords) {
            if (!"Paid".equalsIgnoreCase(rec.getStatus())) {
                rec.setStatus("Paid");
                rec.setPaidAmount(rec.getTotalAmount());
                rec.setBalanceAmount(0.0);
                rec.setPaidDate(paymentDate);
                rec.setPaymentReceiptId(receiptNumber);
                maintenanceRecordRepository.save(rec);
                break;
            }
        }

        // Update Flat maintenance status
        Optional<Flat> optionalFlat = flatRepository.findBySocietyIdAndFlatNumber(societyId, dto.getFlatNumber())
                .or(() -> flatRepository.findByFlatNumber(dto.getFlatNumber()));

        if (optionalFlat.isPresent()) {
            Flat flat = optionalFlat.get();
            flat.setMaintenanceStatus("Paid");
            flatRepository.save(flat);
        }

        // Log activity
        activityService.logActivity(
                dto.getResidentName() + " paid ₹" + String.format("%,.0f", dto.getAmount()),
                "Flat " + dto.getFlatNumber() + " · " + dto.getForMonth() + " via " + dto.getPaymentMode(),
                "payment",
                "text-emerald-600 bg-emerald-100"
        );

        return savedPayment;
    }
}
