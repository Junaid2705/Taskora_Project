package com.example.taskora_backend.controller;

import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.UserRepository;
import com.example.taskora_backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    
    // The folder where images will be saved
    private final String UPLOAD_DIR = "uploads/";

    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        return handleFileUpload(file, "avatar");
    }

    @PostMapping("/upload-cover")
    public ResponseEntity<?> uploadCover(@RequestParam("file") MultipartFile file) {
        return handleFileUpload(file, "cover");
    }

    // Helper method to save the file and update the database
    private ResponseEntity<?> handleFileUpload(MultipartFile file, String imageType) {
        try {
            // 1. Get the currently logged-in user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findById(userDetails.getId()).orElseThrow();

            // 2. Clean the file name and create the path (e.g., uploads/avatar_1.jpg)
            String fileName = imageType + "_" + user.getUserId() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
            Path uploadPath = Paths.get(UPLOAD_DIR);

            // 3. Create the uploads folder if it doesn't exist
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 4. Save the file locally
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 5. Save the URL to the database
            String fileUrl = "http://localhost:8080/uploads/" + fileName;
            if (imageType.equals("avatar")) {
                user.setAvatarUrl(fileUrl);
            } else {
                user.setCoverUrl(fileUrl);
            }
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "message", imageType + " uploaded successfully!",
                    "url", fileUrl
            ));

        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Could not upload the file."));
        }
    }
 // --- Fetch the user's profile data ---
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        
        // Return the data as a Map so React can easily read it
        return ResponseEntity.ok(Map.of(
            "fullName", user.getFullName(),
            "role", user.getRole().name(),
            "bio", user.getBio() != null ? user.getBio() : "",
            "portfolioUrl", user.getPortfolioUrl() != null ? user.getPortfolioUrl() : "",
            "avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : "",
            "coverUrl", user.getCoverUrl() != null ? user.getCoverUrl() : ""
        ));
    }

    // --- Update the text fields (Bio & Portfolio) ---
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        
        user.setBio(updates.get("bio"));
        user.setPortfolioUrl(updates.get("portfolioUrl"));
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully!"));
    }
}