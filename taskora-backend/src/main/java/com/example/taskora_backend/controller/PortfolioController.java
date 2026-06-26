package com.example.taskora_backend.controller;

import com.example.taskora_backend.model.Portfolio;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.PortfolioRepository;
import com.example.taskora_backend.repository.UserRepository;
import com.example.taskora_backend.security.AuthUtils;
import com.example.taskora_backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    // Get my portfolio items
    @GetMapping
    public ResponseEntity<List<Portfolio>> getMyPortfolio() {
        User user = getUser(AuthUtils.currentUserId());
        return ResponseEntity.ok(portfolioRepository.findByUserOrderByCreatedAtDesc(user));
    }

    // Get portfolio by user ID (public - for viewing other's portfolios)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Portfolio>> getUserPortfolio(@PathVariable Long userId) {
        User user = getUser(userId);
        return ResponseEntity.ok(portfolioRepository.findByUserOrderByCreatedAtDesc(user));
    }

    // Get my portfolio filtered by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Portfolio>> getByCategory(@PathVariable String category) {
        User user = getUser(AuthUtils.currentUserId());
        return ResponseEntity.ok(portfolioRepository.findByUserAndCategoryOrderByCreatedAtDesc(user, category));
    }

    // Create a portfolio item (with file upload)
    @PostMapping
    public ResponseEntity<?> create(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "projectUrl", required = false) String projectUrl,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "fileType", defaultValue = "IMAGE") String fileType,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        User user = getUser(AuthUtils.currentUserId());

        Portfolio p = new Portfolio();
        p.setUser(user);
        p.setTitle(title);
        p.setDescription(description);
        p.setProjectUrl(projectUrl);
        p.setCategory(category);
        p.setFileType(fileType.toUpperCase());

        if (file != null && !file.isEmpty()) {
            String url = fileStorageService.store(file, "portfolio");
            p.setFileUrl(url);
            p.setThumbnail(url); // Use same as thumbnail for images
        }

        portfolioRepository.save(p);
        return ResponseEntity.ok(Map.of("message", "Portfolio item created!", "portfolioId", p.getPortfolioId()));
    }

    // Update a portfolio item
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "projectUrl", required = false) String projectUrl,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "fileType", required = false) String fileType,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        Portfolio p = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio item not found."));
        ensureOwner(p);

        if (title != null) p.setTitle(title);
        if (description != null) p.setDescription(description);
        if (projectUrl != null) p.setProjectUrl(projectUrl);
        if (category != null) p.setCategory(category);
        if (fileType != null) p.setFileType(fileType.toUpperCase());

        if (file != null && !file.isEmpty()) {
            String url = fileStorageService.store(file, "portfolio");
            p.setFileUrl(url);
            p.setThumbnail(url);
        }

        portfolioRepository.save(p);
        return ResponseEntity.ok(Map.of("message", "Portfolio item updated!"));
    }

    // Delete a portfolio item
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Portfolio p = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio item not found."));
        ensureOwner(p);
        portfolioRepository.delete(p);
        return ResponseEntity.ok(Map.of("message", "Portfolio item deleted."));
    }

    // Get single item
    @GetMapping("/{id}")
    public ResponseEntity<Portfolio> getById(@PathVariable Long id) {
        Portfolio p = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio item not found."));
        return ResponseEntity.ok(p);
    }

    private void ensureOwner(Portfolio p) {
        if (p.getUser() == null || !p.getUser().getUserId().equals(AuthUtils.currentUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage your own portfolio.");
        }
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
    }
}
