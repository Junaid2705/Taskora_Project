package com.example.taskora_backend.dto;

import lombok.Data;

/**
 * Editable profile fields (Module 2 - User Profile).
 * Core account fields (username/email/role) are managed separately.
 */
@Data
public class ProfileUpdateRequest {

    private String fullName;   // updates User.fullName
    private String headline;
    private String bio;
    private String skills;
    private String experience;
    private String education;
    private String country;
    private String state;
    private String city;
    private String website;
    private String linkedin;
    private String github;
}
