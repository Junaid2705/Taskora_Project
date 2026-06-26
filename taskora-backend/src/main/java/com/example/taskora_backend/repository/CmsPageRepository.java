package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.CmsPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CmsPageRepository extends JpaRepository<CmsPage, Long> {

    Optional<CmsPage> findBySlugAndStatusTrue(String slug);

    List<CmsPage> findByStatusTrue();
}
