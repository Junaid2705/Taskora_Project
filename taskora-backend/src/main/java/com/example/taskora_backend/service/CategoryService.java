package com.example.taskora_backend.service;

import com.example.taskora_backend.dto.CategoryRequest;
import com.example.taskora_backend.model.Category;
import com.example.taskora_backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /** All categories (admin view). */
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    /** Only active categories (public/job-posting view). */
    public List<Category> findActive() {
        return categoryRepository.findByStatusTrue();
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found."));
    }

    public Category create(CategoryRequest request) {
        if (categoryRepository.existsByCategoryNameIgnoreCase(request.getCategoryName().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A category with this name already exists.");
        }
        Category category = new Category();
        category.setCategoryName(request.getCategoryName().trim());
        category.setDescription(request.getDescription());
        category.setStatus(request.getStatus() != null ? request.getStatus() : true);
        return categoryRepository.save(category);
    }

    public Category update(Long id, CategoryRequest request) {
        Category category = findById(id);

        String newName = request.getCategoryName().trim();
        // Only block the rename if the name belongs to a *different* category
        if (!newName.equalsIgnoreCase(category.getCategoryName())
                && categoryRepository.existsByCategoryNameIgnoreCase(newName)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A category with this name already exists.");
        }

        category.setCategoryName(newName);
        category.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            category.setStatus(request.getStatus());
        }
        return categoryRepository.save(category);
    }

    public void delete(Long id) {
        Category category = findById(id);
        categoryRepository.delete(category);
    }
}
