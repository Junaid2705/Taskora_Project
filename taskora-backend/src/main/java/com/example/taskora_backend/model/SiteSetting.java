package com.example.taskora_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "site_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiteSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "setting_id")
    private Long settingId;

    @Column(name = "site_name", length = 255)
    private String siteName;

    @Column(length = 255)
    private String logo;

    @Column(length = 255)
    private String favicon;

    @Column(name = "smtp_host", length = 255)
    private String smtpHost;

    @Column(name = "smtp_port", length = 50)
    private String smtpPort;

    @Column(name = "smtp_email", length = 255)
    private String smtpEmail;

    @Column(name = "smtp_password", length = 255)
    private String smtpPassword;
}