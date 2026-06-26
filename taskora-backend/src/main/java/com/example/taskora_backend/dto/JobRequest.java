package com.example.taskora_backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class JobRequest {
    private String title;
    private String description;
    private String skillsRequired;
    private BigDecimal budget;
    private String experienceRequired;
    private String location;
    private LocalDate deadline; 
    private Long categoryId;

    // Optional: "OPEN" or "CLOSED". Used on update; defaults to OPEN on create.
    private String status;
}