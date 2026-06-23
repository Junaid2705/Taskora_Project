package com.example.taskora_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    // The user who submitted the report
    @ManyToOne
    @JoinColumn(name = "reported_by", referencedColumnName = "user_id")
    private User reportedBy;

    // The user being reported
    @ManyToOne
    @JoinColumn(name = "target_id", referencedColumnName = "user_id")
    private User target;

    @Column(name = "report_type", length = 100)
    private String reportType;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum ReportStatus {
        OPEN,
        RESOLVED
    }
}