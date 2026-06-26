package com.example.taskora_backend.controller;

import com.example.taskora_backend.model.Report;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.ReportRepository;
import com.example.taskora_backend.repository.UserRepository;
import com.example.taskora_backend.security.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    // Any user can submit a report (user, post, job, project, message)
    @PostMapping
    public ResponseEntity<?> submitReport(@RequestBody Map<String, Object> body) {
        User reporter = userRepository.findById(AuthUtils.currentUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        Long targetId = body.get("targetId") != null ? Long.valueOf(body.get("targetId").toString()) : null;
        User target = targetId != null ? userRepository.findById(targetId).orElse(null) : null;

        Report report = new Report();
        report.setReportedBy(reporter);
        report.setTarget(target);
        report.setReportType((String) body.get("reportType"));
        report.setReason((String) body.get("reason"));
        report.setStatus(Report.ReportStatus.OPEN);
        reportRepository.save(report);

        return ResponseEntity.ok(Map.of("message", "Report submitted.", "reportId", report.getReportId()));
    }

    // User: my submitted reports
    @GetMapping("/my-reports")
    public ResponseEntity<?> myReports() {
        return ResponseEntity.ok(reportRepository.findByReportedBy_UserId(AuthUtils.currentUserId()));
    }

    // Admin: all reports
    @GetMapping
    public ResponseEntity<?> getAll() {
        requireAdmin();
        return ResponseEntity.ok(reportRepository.findAll());
    }

    // Admin: open reports only
    @GetMapping("/open")
    public ResponseEntity<?> getOpen() {
        requireAdmin();
        return ResponseEntity.ok(reportRepository.findByStatus(Report.ReportStatus.OPEN));
    }

    // Admin: resolve a report
    @PutMapping("/{id}/resolve")
    public ResponseEntity<?> resolve(@PathVariable Long id) {
        requireAdmin();
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found."));
        report.setStatus(Report.ReportStatus.RESOLVED);
        reportRepository.save(report);
        return ResponseEntity.ok(Map.of("message", "Report resolved."));
    }

    private void requireAdmin() {
        if (!AuthUtils.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required.");
        }
    }
}
