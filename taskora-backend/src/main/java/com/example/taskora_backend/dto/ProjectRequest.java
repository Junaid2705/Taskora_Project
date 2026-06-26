package com.example.taskora_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProjectRequest {

    @NotBlank(message = "Project title is required")
    private String projectTitle;

    private String description;
    private BigDecimal budget;
    private String duration;
    private Long categoryId;

    // Optional: OPEN, IN_PROGRESS, COMPLETED (used on update)
    private String status;
}
