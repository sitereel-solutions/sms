package com.society.management.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Priority is required")
    private String priority;

    @NotBlank(message = "Valid till date is required")
    private String validTill;

    @NotBlank(message = "Content is required")
    private String content;

    @NotBlank(message = "Published by is required")
    private String publishedBy;

    private Boolean isPinned;
    private String attachmentName;
}
