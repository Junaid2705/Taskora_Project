package com.example.taskora_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_bids")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectBid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bid_id")
    private Long bidId;

    // Foreign Key to Projects table
    @ManyToOne
    @JoinColumn(name = "project_id", referencedColumnName = "project_id")
    private Project project;

    // Foreign Key to Users table (Freelancer)
    @ManyToOne
    @JoinColumn(name = "freelancer_id", referencedColumnName = "user_id")
    private User freelancer;

    @Column(columnDefinition = "LONGTEXT")
    private String proposal;

    @Column(name = "bid_amount", precision = 12, scale = 2)
    private BigDecimal bidAmount;

    @Column(name = "delivery_days")
    private Integer deliveryDays;

    @Enumerated(EnumType.STRING)
    private BidStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum BidStatus {
        PENDING,
        ACCEPTED,
        REJECTED
    }
}