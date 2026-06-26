package com.example.taskora_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "portfolios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "portfolio_id")
    private Long portfolioId;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Column(name = "project_url", length = 255)
    private String projectUrl;

    @Column(length = 255)
    private String thumbnail;

    @Column(length = 100)
    private String category; // e.g. Web Development, Mobile App, UI/UX Design

    @Column(name = "file_type", length = 50)
    private String fileType; // IMAGE, VIDEO, DOCUMENT

    @Column(name = "file_url", length = 500)
    private String fileUrl; // URL to the uploaded file (image/video/document)

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}