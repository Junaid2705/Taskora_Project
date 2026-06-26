package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.Job;
import com.example.taskora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    // Fetch all open jobs for the freelancer feed
    List<Job> findByStatus(Job.Status status);
    
    // Fetch all jobs posted by a specific employer
    List<Job> findByEmployer(User employer);
    
    // Fetch jobs by a specific category
    List<Job> findByCategory_CategoryIdAndStatus(Long categoryId, Job.Status status);

    /**
     * Flexible search over OPEN jobs. Every filter is optional: when a
     * parameter is null it is ignored, so any combination of filters works.
     */
    @Query("SELECT j FROM Job j WHERE j.status = :status "
            + "AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "      OR LOWER(j.skillsRequired) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "      OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
            + "AND (:categoryId IS NULL OR j.category.categoryId = :categoryId) "
            + "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) "
            + "AND (:minBudget IS NULL OR j.budget >= :minBudget) "
            + "AND (:maxBudget IS NULL OR j.budget <= :maxBudget) "
            + "ORDER BY j.createdAt DESC")
    List<Job> search(@Param("status") Job.Status status,
                     @Param("keyword") String keyword,
                     @Param("categoryId") Long categoryId,
                     @Param("location") String location,
                     @Param("minBudget") BigDecimal minBudget,
                     @Param("maxBudget") BigDecimal maxBudget);
}