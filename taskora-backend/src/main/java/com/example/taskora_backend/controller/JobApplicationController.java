package com.example.taskora_backend.controller;

import com.example.taskora_backend.dto.JobApplicationRequest;
import com.example.taskora_backend.model.Job;
import com.example.taskora_backend.model.JobApplication;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.JobApplicationRepository;
import com.example.taskora_backend.repository.JobRepository;
import com.example.taskora_backend.repository.UserRepository;
import com.example.taskora_backend.security.AuthUtils;
import com.example.taskora_backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.taskora_backend.service.NotificationService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // 1. Submit an application (For Freelancers)
    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestBody JobApplicationRequest request) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User freelancer = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Error: Job not found."));

        // Prevent duplicate applications
        if (applicationRepository.existsByJobAndFreelancer(job, freelancer)) {
            return ResponseEntity.badRequest().body(Map.of("error", "You have already applied for this job."));
        }

        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setFreelancer(freelancer);
        application.setCoverLetter(request.getCoverLetter());
        application.setExpectedSalary(request.getExpectedSalary());
        application.setResumeUrl(request.getResumeUrl());
        application.setStatus(JobApplication.ApplicationStatus.PENDING);

        applicationRepository.save(application);

        // Notify the employer about the new application
        if (job.getEmployer() != null) {
            notificationService.notify(job.getEmployer().getUserId(), "New Job Application",
                    freelancer.getUsername() + " applied for \"" + job.getTitle() + "\".");
        }

        return ResponseEntity.ok(Map.of("message", "Application submitted successfully!"));
    }

    // 2. View applications for a specific job (For Employers)
    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getApplicationsForJob(@PathVariable Long jobId) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Error: Job not found."));

        // Security check: Only the employer who posted the job can see its applications
        if (!job.getEmployer().getUserId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Unauthorized to view these applications."));
        }

        List<JobApplication> applications = applicationRepository.findByJob(job);
        return ResponseEntity.ok(applications);
    }

    // 3. View my submitted applications (For Freelancers)
    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications() {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User freelancer = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        List<JobApplication> myApplications = applicationRepository.findByFreelancer(freelancer);
        return ResponseEntity.ok(myApplications);
    }

    // 5. Check if current user has already applied to a job
    @GetMapping("/check/{jobId}")
    public ResponseEntity<?> hasApplied(@PathVariable Long jobId) {
        User freelancer = userRepository.findById(AuthUtils.currentUserId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found."));
        boolean applied = applicationRepository.existsByJobAndFreelancer(job, freelancer);
        return ResponseEntity.ok(Map.of("applied", applied));
    }

    // 4. Update an application's status (For Employers who own the job)
    //    Accepted values: PENDING, REVIEWING, ACCEPTED, REJECTED
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long applicationId,
                                                     @RequestBody Map<String, String> payload) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found."));

        // Only the employer who posted the job may change its applications
        if (application.getJob().getEmployer() == null
                || !application.getJob().getEmployer().getUserId().equals(AuthUtils.currentUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage applications for your own jobs.");
        }

        String statusValue = payload.get("status");
        if (statusValue == null || statusValue.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status is required.");
        }

        JobApplication.ApplicationStatus newStatus;
        try {
            newStatus = JobApplication.ApplicationStatus.valueOf(statusValue.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid status. Use PENDING, SHORTLISTED, REJECTED or HIRED.");
        }

        application.setStatus(newStatus);
        applicationRepository.save(application);

        return ResponseEntity.ok(Map.of("message", "Application status updated to " + newStatus.name() + "."));
    }
}