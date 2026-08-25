package com.society.management.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankDetails {
    private String accountName;
    private String accountNumber;
    private String bankName;
    private String ifsc;
    private String branch;
    private String upiId;
}
