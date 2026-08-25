package com.society.management.controller;

import com.society.management.dto.PaymentRequestDto;
import com.society.management.entity.PaymentTransaction;
import com.society.management.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Endpoints for recording payments and generating receipts")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @Operation(summary = "Get all payment transactions")
    public ResponseEntity<List<PaymentTransaction>> getAllPayments(
            @RequestParam(required = false) String flatNumber) {
        if (flatNumber != null && !flatNumber.isBlank()) {
            return ResponseEntity.ok(paymentService.getPaymentsByFlatNumber(flatNumber));
        }
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payment transaction by ID")
    public ResponseEntity<PaymentTransaction> getPaymentById(@PathVariable String id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/receipt/{receiptNumber}")
    @Operation(summary = "Get payment receipt by receipt number")
    public ResponseEntity<PaymentTransaction> getPaymentByReceiptNumber(@PathVariable String receiptNumber) {
        return ResponseEntity.ok(paymentService.getPaymentByReceiptNumber(receiptNumber));
    }

    @PostMapping
    @Operation(summary = "Record a new payment transaction")
    public ResponseEntity<PaymentTransaction> recordPayment(@Valid @RequestBody PaymentRequestDto request) {
        return new ResponseEntity<>(paymentService.recordPayment(request), HttpStatus.CREATED);
    }
}
