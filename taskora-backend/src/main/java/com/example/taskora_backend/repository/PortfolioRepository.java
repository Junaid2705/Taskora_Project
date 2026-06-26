package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.Portfolio;
import com.example.taskora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    List<Portfolio> findByUserOrderByCreatedAtDesc(User user);

    List<Portfolio> findByUserAndCategoryOrderByCreatedAtDesc(User user, String category);
}
