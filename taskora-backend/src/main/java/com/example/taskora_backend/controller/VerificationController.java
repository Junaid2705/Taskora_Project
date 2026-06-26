package com.example.taskora_backend.controller;

import com.example.taskora_backend.model.User;
import com.example.taskora_backend.model.UserVerification;
import com.example.taskora_backend.repository.UserVerificationRepository;
import com.example.taskora_backend.repository.UserRepository;
import com.example.taskora_backend.security.AuthUtils;
import com.example.taskora_backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final UserVerificationRepository verificationRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    // User submits a verification document
    @PostMapping("/submit")
    public ResponseEntity<?> submit(
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file) {
        User user = userRepository.findById(AuthUtils.currentUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        String url = fileStorageService.store(file, "verification");

        UserVerification v = new UserVerification();
        v.setUser(user);
        v.setDocumentType(documentType);
        v.setDocumentUrl(url);
        v.setStatus(UserVerification.VerificationStatus.PENDING);
        verificationRepository.save(v);
        return ResponseEntity.ok(Map.of("message", "Verification document submitted.", "id", v.getVerificationId()));
    }

    // User: see my verification requests
    @GetMapping("/my-requests")
    public ResponseEntity<?> myRequests() {
        return ResponseEntity.ok(verificationRepository.findByUser_UserId(AuthUtils.currentUserId()));
    }

    // Admin: list all pending verifications
    @GetMapping("/pending")
    public ResponseEntity<?> getPending() {
        requireAdmin();
        return ResponseEntity.ok(verificationRepository.findByStatus(UserVerification.VerificationStatus.PENDING));
    }

    // Admin: list all verifications
    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        requireAdmin();
        return ResponseEntity.ok(verificationRepository.findAll());
    }

    // Admin: approve
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        requireAdmin();
        UserVerification v = verificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Verification request not found."));
        v.setStatus(UserVerification.VerificationStatus.APPROVED);
        if (body != null && body.get("remarks") != null) v.setRemarks(body.get("remarks"));
        verificationRepository.save(v);
        return ResponseEntity.ok(Map.of("message", "Verification approved."));
    }

    // Admin: reject
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        requireAdmin();
        UserVerification v = verificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Verification request not found."));
        v.setStatus(UserVerification.VerificationStatus.REJECTED);
        if (body != null && body.get("remarks") != null) v.setRemarks(body.get("remarks"));
        verificationRepository.save(v);
        return ResponseEntity.ok(Map.of("message", "Verification rejected."));
    }

    private void requireAdmin() {
        if (!AuthUtils.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required.");
        }
    }
}
