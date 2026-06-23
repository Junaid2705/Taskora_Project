package com.example.taskora_backend.controller;

import com.example.taskora_backend.dto.JobRequest;
import com.example.taskora_backend.model.Category;
import com.example.taskora_backend.model.Job;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.CategoryRepository;
import com.example.taskora_backend.repository.JobRepository;
import com.example.taskora_backend.repository.UserRepository;
import com.example.taskora_backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobRepository jobRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    // 1. Get all active categories (Public/All Users)
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        List<Category> categories = categoryRepository.findByStatusTrue();
        return ResponseEntity.ok(categories);
    }

    // 2. Fetch all open jobs for the feed (Public/All Users)
    @GetMapping("/feed")
    public ResponseEntity<?> getJobFeed() {
        List<Job> openJobs = jobRepository.findByStatus(Job.Status.OPEN);
        return ResponseEntity.ok(openJobs);
    }

    // 3. Post a new job (Protected - Must be logged in)
    @PostMapping("/create")
    public ResponseEntity<?> createJob(@RequestBody JobRequest jobRequest) {
        
        // Find out exactly who is making this request using the JWT token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userRole = userDetails.getAuthorities().iterator().next().getAuthority();
        if (!userRole.equals("ROLE_EMPLOYER")) {
            return ResponseEntity.status(403).body(Map.of("error", "Unauthorized: Only Employers can post jobs."));
        }
        User employer = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        // Verify the category exists
        Category category = categoryRepository.findById(jobRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Error: Category not found."));

        // Build and save the new Job entity
        Job newJob = new Job();
        newJob.setEmployer(employer);
        newJob.setCategory(category);
        newJob.setTitle(jobRequest.getTitle());
        newJob.setDescription(jobRequest.getDescription());
        newJob.setSkillsRequired(jobRequest.getSkillsRequired());
        newJob.setBudget(jobRequest.getBudget());
        newJob.setExperienceRequired(jobRequest.getExperienceRequired());
        newJob.setLocation(jobRequest.getLocation());
        newJob.setDeadline(jobRequest.getDeadline());
        newJob.setStatus(Job.Status.OPEN);

        jobRepository.save(newJob);

        return ResponseEntity.ok(Map.of("message", "Job posted successfully!", "jobId", newJob.getJobId().toString()));
    }
}