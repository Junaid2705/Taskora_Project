package com.example.taskora_backend.controller;

import com.example.taskora_backend.dto.ChangePasswordRequest;
import com.example.taskora_backend.dto.ProfileUpdateRequest;
import com.example.taskora_backend.model.PortfolioItem;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.UserRepository;
import com.example.taskora_backend.security.AuthUtils;
import com.example.taskora_backend.service.FileStorageService;
import com.example.taskora_backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    // --- Fetch the logged-in user's full account + profile ---
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        return ResponseEntity.ok(profileService.getMyProfile(AuthUtils.currentUserId()));
    }

    // --- Update profile text fields ---
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(AuthUtils.currentUserId(), request));
    }

    // --- Upload avatar image ---
    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        String url = profileService.uploadAvatar(AuthUtils.currentUserId(), file);
        return ResponseEntity.ok(Map.of("message", "Avatar uploaded successfully!", "url", url));
    }

    // --- Upload cover image ---
    @PostMapping("/upload-cover")
    public ResponseEntity<?> uploadCover(@RequestParam("file") MultipartFile file) {
        String url = profileService.uploadCover(AuthUtils.currentUserId(), file);
        return ResponseEntity.ok(Map.of("message", "Cover uploaded successfully!", "url", url));
    }

    // --- Change password ---
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        profileService.changePassword(AuthUtils.currentUserId(), request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully!"));
    }

    // --- Delete account ---
    @DeleteMapping("/delete-account")
    public ResponseEntity<?> deleteAccount() {
        profileService.deleteAccount(AuthUtils.currentUserId());
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully."));
    }

    // --- Add a portfolio project (kept here until the standalone Portfolio module) ---
    @PostMapping("/portfolio")
    public ResponseEntity<?> addPortfolioItem(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("projectUrl") String projectUrl,
            @RequestParam("file") MultipartFile file) {

        User user = userRepository.findById(AuthUtils.currentUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        String fileUrl = fileStorageService.store(file, "portfolio");

        PortfolioItem item = new PortfolioItem();
        item.setTitle(title);
        item.setDescription(description);
        item.setProjectUrl(projectUrl);
        item.setImageUrl(fileUrl);
        item.setUser(user);

        user.getPortfolioItems().add(item);
        userRepository.save(user); // cascade persists the item

        return ResponseEntity.ok(Map.of("message", "Project added to portfolio successfully!", "imageUrl", fileUrl));
    }

    // --- Get the user's portfolio items ---
    @GetMapping("/portfolio")
    public ResponseEntity<?> getMyPortfolio() {
        User user = userRepository.findById(AuthUtils.currentUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        return ResponseEntity.ok(user.getPortfolioItems());
    }

    // --- Change username ---
    @PutMapping("/change-username")
    public ResponseEntity<?> changeUsername(@RequestBody Map<String, String> body) {
        String newUsername = body.get("username");
        if (newUsername == null || newUsername.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username required.");
        Long userId = AuthUtils.currentUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        if (userRepository.existsByUsername(newUsername.trim()) && !user.getUsername().equals(newUsername.trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken.");
        }
        user.setUsername(newUsername.trim());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Username changed successfully!", "username", user.getUsername()));
    }

    // --- Delete a portfolio item ---
    @DeleteMapping("/portfolio/{itemId}")
    public ResponseEntity<?> deletePortfolioItem(@PathVariable Long itemId) {
        User user = userRepository.findById(AuthUtils.currentUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        user.getPortfolioItems().removeIf(item -> item.getId() != null && item.getId().equals(itemId));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Portfolio item deleted."));
    }
}
