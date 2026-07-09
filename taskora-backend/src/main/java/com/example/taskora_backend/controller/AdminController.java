package com.example.taskora_backend.controller;

import com.example.taskora_backend.model.Job;
import com.example.taskora_backend.model.Project;
import com.example.taskora_backend.model.Subscription;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.*;
import com.example.taskora_backend.security.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ProjectRepository projectRepository;
    private final JobApplicationRepository applicationRepository;
    private final CategoryRepository categoryRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final PostCommentRepository postCommentRepository;
    private final MessageRepository messageRepository;
    private final NotificationRepository notificationRepository;
    private final ProjectBidRepository bidRepository;
    private final PortfolioRepository portfolioRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserVerificationRepository verificationRepository;
    private final ReportRepository reportRepository;

    // =============== Dashboard Stats ===============
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        requireAdmin();
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalJobs", jobRepository.count());
        stats.put("totalProjects", projectRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("totalCategories", categoryRepository.count());
        stats.put("activeSubscriptions", subscriptionRepository.countByStatus(Subscription.SubscriptionStatus.ACTIVE));
        stats.put("totalFreelancers", userRepository.countByRole(User.Role.FREELANCER));
        stats.put("totalEmployers", userRepository.countByRole(User.Role.EMPLOYER));
        stats.put("totalCreators", userRepository.countByRole(User.Role.CREATOR));
        stats.put("revenue", subscriptionRepository.findAll().stream()
            .filter(s -> s.getStatus() == Subscription.SubscriptionStatus.ACTIVE)
            .map(s -> s.getMonthlyPrice() != null ? s.getMonthlyPrice() : java.math.BigDecimal.ZERO)
            .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add));
        return ResponseEntity.ok(stats);
    }

    // =============== User Management ===============
    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        requireAdmin();
        var users = userRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        requireAdmin();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        requireAdmin();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        String status = payload.get("status");
        if (status == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status is required.");
        try {
            user.setStatus(User.Status.valueOf(status.trim().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status. Use ACTIVE, INACTIVE or BLOCKED.");
        }
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User status updated to " + user.getStatus()));
    }

    @DeleteMapping("/users/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        requireAdmin();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        // Delete all related data (order matters for FK constraints)
        // 1. Post likes and comments (reference posts AND user)
        postLikeRepository.deleteByUser(user);
        postCommentRepository.deleteByUser(user);
        // 2. Posts by user
        postRepository.deleteByUser(user);
        // 3. Job applications
        applicationRepository.deleteByFreelancer(user);
        // 4. Jobs posted by employer
        jobRepository.deleteByEmployer(user);
        // 5. Project bids
        bidRepository.deleteByFreelancer(user);
        // 6. Projects
        projectRepository.deleteByUser(user);
        // 7. Messages (sender or receiver)
        messageRepository.deleteBySender(user);
        messageRepository.deleteByReceiver(user);
        // 8. Notifications
        notificationRepository.deleteByUser(user);
        // 9. Subscriptions (both as creator and subscriber)
        subscriptionRepository.deleteByCreator(user);
        subscriptionRepository.deleteBySubscriber(user);
        // 10. Reports (both as reporter and target)
        reportRepository.deleteByReportedBy(user);
        reportRepository.deleteByTarget(user);
        // 11. Portfolio
        portfolioRepository.deleteByUser(user);
        // 12. UserProfile
        userProfileRepository.deleteByUser(user);
        // 13. UserVerification
        verificationRepository.deleteByUser(user);
        // Finally delete the user itself
        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("message", "User deleted."));
    }

    // =============== Jobs Management ===============
    @GetMapping("/jobs")
    public ResponseEntity<?> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        requireAdmin();
        return ResponseEntity.ok(jobRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        requireAdmin();
        jobRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Job deleted."));
    }

    @PutMapping("/jobs/{id}/approve")
    public ResponseEntity<?> approveJob(@PathVariable Long id) {
        requireAdmin();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found."));
        job.setStatus(Job.Status.OPEN);
        jobRepository.save(job);
        return ResponseEntity.ok(Map.of("message", "Job approved and now visible to freelancers."));
    }

    @PutMapping("/jobs/{id}/reject")
    public ResponseEntity<?> rejectJob(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        requireAdmin();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found."));
        job.setStatus(Job.Status.REJECTED);
        jobRepository.save(job);
        return ResponseEntity.ok(Map.of("message", "Job rejected."));
    }

    // =============== Projects Management ===============
    @GetMapping("/projects")
    public ResponseEntity<?> getAllProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        requireAdmin();
        return ResponseEntity.ok(projectRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        requireAdmin();
        projectRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Project deleted."));
    }

    @PutMapping("/projects/{id}/approve")
    public ResponseEntity<?> approveProject(@PathVariable Long id) {
        requireAdmin();
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found."));
        project.setProjectStatus(Project.ProjectStatus.OPEN);
        projectRepository.save(project);
        return ResponseEntity.ok(Map.of("message", "Project approved and now visible to freelancers."));
    }

    @PutMapping("/projects/{id}/reject")
    public ResponseEntity<?> rejectProject(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        requireAdmin();
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found."));
        project.setProjectStatus(Project.ProjectStatus.REJECTED);
        projectRepository.save(project);
        return ResponseEntity.ok(Map.of("message", "Project rejected."));
    }

    // =============== Subscriptions Management ===============
    @GetMapping("/subscriptions")
    public ResponseEntity<?> getAllSubscriptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        requireAdmin();
        return ResponseEntity.ok(subscriptionRepository.findAll(PageRequest.of(page, size)));
    }

    @DeleteMapping("/subscriptions/{id}")
    public ResponseEntity<?> deleteSubscription(@PathVariable Long id) {
        requireAdmin();
        subscriptionRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Subscription deleted."));
    }

    @PutMapping("/subscriptions/{id}")
    public ResponseEntity<?> updateSubscription(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        requireAdmin();
        var sub = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription not found."));
        if (payload.containsKey("monthlyPrice")) {
            sub.setMonthlyPrice(new java.math.BigDecimal(payload.get("monthlyPrice").toString()));
        }
        if (payload.containsKey("status")) {
            try {
                sub.setStatus(com.example.taskora_backend.model.Subscription.SubscriptionStatus.valueOf(
                        payload.get("status").toString().trim().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status. Use ACTIVE or EXPIRED.");
            }
        }
        subscriptionRepository.save(sub);
        return ResponseEntity.ok(Map.of("message", "Subscription updated."));
    }

    // =============== Applications Management ===============
    @GetMapping("/applications")
    public ResponseEntity<?> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        requireAdmin();
        return ResponseEntity.ok(applicationRepository.findAll(PageRequest.of(page, size)));
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        requireAdmin();
        var app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found."));
        String status = payload.get("status");
        if (status == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status required.");
        try {
            app.setStatus(com.example.taskora_backend.model.JobApplication.ApplicationStatus.valueOf(status.trim().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status.");
        }
        applicationRepository.save(app);
        return ResponseEntity.ok(Map.of("message", "Application status updated."));
    }

    @DeleteMapping("/applications/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable Long id) {
        requireAdmin();
        applicationRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Application deleted."));
    }

    // =============== Posts Management ===============
    @GetMapping("/posts")
    public ResponseEntity<?> getAllPosts(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        requireAdmin();
        return ResponseEntity.ok(postRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        requireAdmin();
        postRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Post deleted."));
    }

    // =============== helper ===============
    private void requireAdmin() {
        if (!AuthUtils.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required.");
        }
    }
}
