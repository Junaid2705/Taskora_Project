package com.example.taskora_backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class JobApplicationRequest {
    private Long jobId;
    private String coverLetter;
    private BigDecimal expectedSalary;
    private String resumeUrl; // Optional link to their portfolio/resume
}