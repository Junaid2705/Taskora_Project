package com.example.taskora_backend.controller;

import com.example.taskora_backend.model.SiteSetting;
import com.example.taskora_backend.repository.SiteSettingRepository;
import com.example.taskora_backend.security.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SiteSettingController {

    private final SiteSettingRepository settingRepository;

    // Public: get current site settings (site name, logo, favicon for the frontend shell)
    @GetMapping
    public ResponseEntity<?> getSettings() {
        return ResponseEntity.ok(settingRepository.findAll().stream().findFirst().orElse(new SiteSetting()));
    }

    // Admin: update settings (upsert — creates if none exist, updates if one exists)
    @PutMapping
    public ResponseEntity<?> updateSettings(@RequestBody SiteSetting incoming) {
        requireAdmin();
        SiteSetting existing = settingRepository.findAll().stream().findFirst().orElse(new SiteSetting());
        if (incoming.getSiteName() != null) existing.setSiteName(incoming.getSiteName());
        if (incoming.getLogo() != null) existing.setLogo(incoming.getLogo());
        if (incoming.getFavicon() != null) existing.setFavicon(incoming.getFavicon());
        if (incoming.getSmtpHost() != null) existing.setSmtpHost(incoming.getSmtpHost());
        if (incoming.getSmtpPort() != null) existing.setSmtpPort(incoming.getSmtpPort());
        if (incoming.getSmtpEmail() != null) existing.setSmtpEmail(incoming.getSmtpEmail());
        if (incoming.getSmtpPassword() != null) existing.setSmtpPassword(incoming.getSmtpPassword());
        settingRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Settings updated successfully."));
    }

    private void requireAdmin() {
        if (!AuthUtils.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required.");
        }
    }
}
