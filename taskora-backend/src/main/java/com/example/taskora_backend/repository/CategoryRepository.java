package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Find all categories that are currently active
    List<Category> findByStatusTrue();

    // Used to prevent duplicate category names (case-insensitive)
    boolean existsByCategoryNameIgnoreCase(String categoryName);
}