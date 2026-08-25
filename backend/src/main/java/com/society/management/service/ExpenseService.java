package com.society.management.service;

import com.society.management.dto.ExpenseRequestDto;
import com.society.management.entity.Expense;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.repository.ExpenseRepository;
import com.society.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ActivityService activityService;

    @Transactional(readOnly = true)
    public List<Expense> getAllExpenses() {
        if (SecurityUtils.isSuperAdmin()) {
            return expenseRepository.findAll();
        }
        String societyId = SecurityUtils.getCurrentSocietyId();
        return expenseRepository.findBySocietyId(societyId);
    }

    @Transactional(readOnly = true)
    public Expense getExpenseById(String id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Expense> getExpensesByCategory(String category) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        return expenseRepository.findBySocietyIdAndCategory(societyId, category);
    }

    @Transactional
    public Expense addExpense(ExpenseRequestDto dto) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        String expenseId = "exp-" + (societyId != null ? societyId + "-" : "") + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4);
        String date = dto.getDate() != null && !dto.getDate().isBlank() ? dto.getDate() : "24 Aug 2026";
        String status = dto.getStatus() != null && !dto.getStatus().isBlank() ? dto.getStatus() : "Paid";
        String invoiceNumber = dto.getInvoiceNumber() != null && !dto.getInvoiceNumber().isBlank()
                ? dto.getInvoiceNumber()
                : "INV-2026-" + (1000 + expenseRepository.count() + 1);

        Expense expense = Expense.builder()
                .id(expenseId)
                .societyId(societyId)
                .date(date)
                .category(dto.getCategory())
                .description(dto.getDescription())
                .vendor(dto.getVendor())
                .vendorContact(dto.getVendorContact())
                .invoiceNumber(invoiceNumber)
                .amount(dto.getAmount())
                .paymentMode(dto.getPaymentMode())
                .status(status)
                .approvedBy(dto.getApprovedBy() != null ? dto.getApprovedBy() : "Admin")
                .notes(dto.getNotes())
                .build();

        Expense saved = expenseRepository.save(expense);

        activityService.logActivity(
                dto.getCategory() + " expense ₹" + String.format("%,.0f", dto.getAmount()) + " added",
                dto.getVendor() + " · " + dto.getDescription(),
                "expense",
                "text-amber-600 bg-amber-100"
        );

        return saved;
    }

    @Transactional
    public Expense updateExpense(String id, ExpenseRequestDto dto) {
        Expense expense = getExpenseById(id);
        if (dto.getCategory() != null) expense.setCategory(dto.getCategory());
        if (dto.getDescription() != null) expense.setDescription(dto.getDescription());
        if (dto.getVendor() != null) expense.setVendor(dto.getVendor());
        if (dto.getVendorContact() != null) expense.setVendorContact(dto.getVendorContact());
        if (dto.getAmount() != null) expense.setAmount(dto.getAmount());
        if (dto.getPaymentMode() != null) expense.setPaymentMode(dto.getPaymentMode());
        if (dto.getStatus() != null) expense.setStatus(dto.getStatus());
        if (dto.getApprovedBy() != null) expense.setApprovedBy(dto.getApprovedBy());
        if (dto.getNotes() != null) expense.setNotes(dto.getNotes());
        return expenseRepository.save(expense);
    }

    @Transactional
    public void deleteExpense(String id) {
        Expense expense = getExpenseById(id);
        expenseRepository.delete(expense);
    }
}
