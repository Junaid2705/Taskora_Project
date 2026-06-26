package com.example.taskora_backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "full_name", length = 150)
    private String fullName;

    @Column(length = 100, unique = true)
    private String username;

    @Column(length = 150, unique = true)
    private String email;

    @Column(length = 20)
    private String mobile;

    @JsonIgnore
    @Column(length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "email_verified", columnDefinition = "boolean default false")
    private Boolean emailVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(20) default 'ACTIVE'")
    private Status status = Status.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;// --- Profile Management Fields ---
    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "cover_url")
    private String coverUrl;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PortfolioItem> portfolioItems = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String portfolioUrl; // Link to their GitHub, Behance, or personal site

    // --- THE BULLETPROOF FIX: Manual Getter ---
    public Long getUserId() {
        return this.userId;
    }

    public enum Role {
        ADMIN,
        EMPLOYER,
        FREELANCER,
        CREATOR
    }

    public enum Status {
        ACTIVE,
        INACTIVE,
        BLOCKED
    }
}