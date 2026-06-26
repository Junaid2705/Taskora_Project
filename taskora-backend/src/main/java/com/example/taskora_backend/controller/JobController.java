package com.example.taskora_backend.controller;

import com.example.taskora_backend.dto.JobRequest;
import com.example.taskora_backend.model.Category;
import com.example.taskora_backend.model.Job;
import com.example.taskora_backend.security.AuthUtils;
import com.example.taskora_backend.service.CategoryService;
import com.example.taskora_backend.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final CategoryService categoryService;

    // 1. Active categories (Public) - kept for frontend backward compatibility
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryService.findActive());
    }

    // 2. Open-job feed (Public)
    @GetMapping("/feed")
    public ResponseEntity<List<Job>> getJobFeed() {
        return ResponseEntity.ok(jobService.getFeed());
    }

    // 3. Search open jobs with optional filters (Public)
    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minBudget,
            @RequestParam(required = false) BigDecimal maxBudget) {
        return ResponseEntity.ok(jobService.search(keyword, categoryId, location, minBudget, maxBudget));
    }

    // 4. Jobs posted by the logged-in employer
    @GetMapping("/my-jobs")
    public ResponseEntity<List<Job>> getMyJobs() {
        return ResponseEntity.ok(jobService.getMyJobs(AuthUtils.currentUserId()));
    }

    // 5. Job details
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getById(id));
    }

    // 6. Create a job (Employer)
    @PostMapping("/create")
    public ResponseEntity<?> createJob(@RequestBody JobRequest jobRequest) {
        Job job = jobService.create(jobRequest, AuthUtils.currentUserId());
        return ResponseEntity.ok(Map.of("message", "Job posted successfully!", "jobId", job.getJobId().toString()));
    }

    // 7. Update a job (Employer, owner only)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody JobRequest jobRequest) {
        Job job = jobService.update(id, jobRequest, AuthUtils.currentUserId());
        return ResponseEntity.ok(Map.of("message", "Job updated successfully!", "jobId", job.getJobId().toString()));
    }

    // 8. Delete a job (Employer, owner only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        jobService.delete(id, AuthUtils.currentUserId());
        return ResponseEntity.ok(Map.of("message", "Job deleted successfully!"));
    }
}
