package com.example.taskora_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Long jobId;

    // Foreign Key to Users table (Employer)
    @ManyToOne
    @JoinColumn(name = "employer_id", referencedColumnName = "user_id")
    private User employer;

    // Foreign Key to Categories table
    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private Category category;

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Column(name = "skills_required", columnDefinition = "TEXT")
    private String skillsRequired;

    @Column(precision = 12, scale = 2)
    private BigDecimal budget;

    @Column(name = "experience_required", length = 100)
    private String experienceRequired;

    @Column(length = 150)
    private String location;

    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    private Status status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum Status {
        PENDING_APPROVAL,
        OPEN,
        CLOSED,
        REJECTED
    }
}