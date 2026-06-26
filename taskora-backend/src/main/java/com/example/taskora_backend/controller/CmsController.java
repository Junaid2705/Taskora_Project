package com.example.taskora_backend.controller;

import com.example.taskora_backend.model.CmsPage;
import com.example.taskora_backend.repository.CmsPageRepository;
import com.example.taskora_backend.security.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/cms")
@RequiredArgsConstructor
public class CmsController {

    private final CmsPageRepository cmsPageRepository;

    // Public: get a page by slug (About Us, Privacy, etc.)
    @GetMapping("/{slug}")
    public ResponseEntity<?> getBySlug(@PathVariable String slug) {
        CmsPage page = cmsPageRepository.findBySlugAndStatusTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Page not found."));
        return ResponseEntity.ok(page);
    }

    // Public: list all active pages (for footer links)
    @GetMapping
    public ResponseEntity<?> listPages() {
        return ResponseEntity.ok(cmsPageRepository.findByStatusTrue());
    }

    // Admin: create page
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CmsPage page) {
        requireAdmin();
        cmsPageRepository.save(page);
        return ResponseEntity.ok(Map.of("message", "Page created.", "pageId", page.getPageId()));
    }

    // Admin: update page
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CmsPage updates) {
        requireAdmin();
        CmsPage page = cmsPageRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Page not found."));
        if (updates.getTitle() != null) page.setTitle(updates.getTitle());
        if (updates.getSlug() != null) page.setSlug(updates.getSlug());
        if (updates.getContent() != null) page.setContent(updates.getContent());
        if (updates.getStatus() != null) page.setStatus(updates.getStatus());
        cmsPageRepository.save(page);
        return ResponseEntity.ok(Map.of("message", "Page updated."));
    }

    // Admin: delete page
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        requireAdmin();
        cmsPageRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Page deleted."));
    }

    private void requireAdmin() {
        if (!AuthUtils.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required.");
        }
    }
}
