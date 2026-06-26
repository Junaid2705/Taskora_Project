package com.example.taskora_backend.controller;

import com.example.taskora_backend.dto.CategoryRequest;
import com.example.taskora_backend.model.Category;
import com.example.taskora_backend.security.AuthUtils;
import com.example.taskora_backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // Public: list active categories (for job posting forms, search filters, etc.)
    @GetMapping("/active")
    public ResponseEntity<List<Category>> getActiveCategories() {
        return ResponseEntity.ok(categoryService.findActive());
    }

    // Admin: list every category (active + inactive)
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        requireAdmin();
        return ResponseEntity.ok(categoryService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategory(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    // Admin: create
    @PostMapping
    public ResponseEntity<Category> createCategory(@Valid @RequestBody CategoryRequest request) {
        requireAdmin();
        Category created = categoryService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Admin: update
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id,
                                                   @Valid @RequestBody CategoryRequest request) {
        requireAdmin();
        return ResponseEntity.ok(categoryService.update(id, request));
    }

    // Admin: delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        requireAdmin();
        categoryService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted successfully."));
    }

    private void requireAdmin() {
        if (!AuthUtils.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only administrators can manage categories.");
        }
    }
}
