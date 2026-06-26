package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.Project;
import com.example.taskora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByProjectStatus(Project.ProjectStatus status);

    List<Project> findByUser(User user);

    /**
     * Flexible search over OPEN projects. Every filter is optional.
     */
    @Query("SELECT p FROM Project p WHERE p.projectStatus = :status "
            + "AND (:keyword IS NULL OR LOWER(p.projectTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) "
            + "      OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
            + "AND (:categoryId IS NULL OR p.category.categoryId = :categoryId) "
            + "AND (:minBudget IS NULL OR p.budget >= :minBudget) "
            + "AND (:maxBudget IS NULL OR p.budget <= :maxBudget) "
            + "ORDER BY p.createdAt DESC")
    List<Project> search(@Param("status") Project.ProjectStatus status,
                         @Param("keyword") String keyword,
                         @Param("categoryId") Long categoryId,
                         @Param("minBudget") BigDecimal minBudget,
                         @Param("maxBudget") BigDecimal maxBudget);
}
