package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.Job;
import com.example.taskora_backend.model.JobApplication;
import com.example.taskora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    
    // See all applications for a specific job (For Employers)
    List<JobApplication> findByJob(Job job);
    
    // See all jobs a freelancer has applied to (For Freelancers)
    List<JobApplication> findByFreelancer(User freelancer);
    
    // Check if a freelancer already applied to this job
    Boolean existsByJobAndFreelancer(Job job, User freelancer);
}