package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.Job;
import com.example.taskora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    // Fetch all open jobs for the freelancer feed
    List<Job> findByStatus(Job.Status status);
    
    // Fetch all jobs posted by a specific employer
    List<Job> findByEmployer(User employer);
    
    // Fetch jobs by a specific category
    List<Job> findByCategory_CategoryIdAndStatus(Long categoryId, Job.Status status);
}