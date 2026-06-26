package com.example.taskora_backend.service;

import com.example.taskora_backend.dto.JobRequest;
import com.example.taskora_backend.model.Category;
import com.example.taskora_backend.model.Job;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.CategoryRepository;
import com.example.taskora_backend.repository.JobRepository;
import com.example.taskora_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<Job> getFeed() {
        return jobRepository.findByStatus(Job.Status.OPEN);
    }

    public List<Job> search(String keyword, Long categoryId, String location,
                            BigDecimal minBudget, BigDecimal maxBudget) {
        String k = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        String loc = (location != null && !location.isBlank()) ? location.trim() : null;
        return jobRepository.search(Job.Status.OPEN, k, categoryId, loc, minBudget, maxBudget);
    }

    public Job getById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found."));
    }

    public List<Job> getMyJobs(Long employerId) {
        User employer = getUser(employerId);
        return jobRepository.findByEmployer(employer);
    }

    public Job create(JobRequest request, Long employerId) {
        User employer = getUser(employerId);
        if (employer.getRole() != User.Role.EMPLOYER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only employers can post jobs.");
        }
        Category category = getCategory(request.getCategoryId());

        Job job = new Job();
        job.setEmployer(employer);
        applyRequest(job, request, category);
        job.setStatus(Job.Status.OPEN);
        return jobRepository.save(job);
    }

    public Job update(Long jobId, JobRequest request, Long employerId) {
        Job job = getById(jobId);
        ensureOwner(job, employerId);

        Category category = request.getCategoryId() != null
                ? getCategory(request.getCategoryId())
                : job.getCategory();
        applyRequest(job, request, category);

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            job.setStatus(parseStatus(request.getStatus()));
        }
        return jobRepository.save(job);
    }

    public void delete(Long jobId, Long employerId) {
        Job job = getById(jobId);
        ensureOwner(job, employerId);
        jobRepository.delete(job);
    }

    // --- helpers ---

    private void applyRequest(Job job, JobRequest request, Category category) {
        job.setCategory(category);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setSkillsRequired(request.getSkillsRequired());
        job.setBudget(request.getBudget());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setLocation(request.getLocation());
        job.setDeadline(request.getDeadline());
    }

    private void ensureOwner(Job job, Long employerId) {
        if (job.getEmployer() == null || !job.getEmployer().getUserId().equals(employerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage your own jobs.");
        }
    }

    private Job.Status parseStatus(String status) {
        try {
            return Job.Status.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status. Use OPEN or CLOSED.");
        }
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
    }

    private Category getCategory(Long id) {
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category is required.");
        }
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found."));
    }
}
