package com.society.management.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommitteeMember {
    private String role;
    private String name;
    private String flatNumber;
    private String phone;
    private String email;
}
