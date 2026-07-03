package com.example.taskora_backend.controller;

import com.example.taskora_backend.dto.ProjectRequest;
import com.example.taskora_backend.model.Project;
import com.example.taskora_backend.security.AuthUtils;
import com.example.taskora_backend.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // Public: list open projects
    @GetMapping("/feed")
    public ResponseEntity<List<Project>> getFeed() {
        return ResponseEntity.ok(projectService.getOpenProjects());
    }

    // Public: search open projects
    @GetMapping("/search")
    public ResponseEntity<List<Project>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minBudget,
            @RequestParam(required = false) BigDecimal maxBudget) {
        return ResponseEntity.ok(projectService.search(keyword, categoryId, minBudget, maxBudget));
    }

    // Projects owned by the logged-in user
    @GetMapping("/my-projects")
    public ResponseEntity<List<Project>> getMyProjects() {
        return ResponseEntity.ok(projectService.getMyProjects(AuthUtils.currentUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getById(id));
    }

    @PostMapping
    public ResponseEntity<?> createProject(@Valid @RequestBody ProjectRequest request) {
        if ("ROLE_CREATOR".equals(AuthUtils.currentRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Creators cannot post projects.");
        }
        Project project = projectService.create(request, AuthUtils.currentUserId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Project created successfully!", "projectId", project.getProjectId().toString()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        Project project = projectService.update(id, request, AuthUtils.currentUserId());
        return ResponseEntity.ok(Map.of("message", "Project updated successfully!", "projectId", project.getProjectId().toString()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.delete(id, AuthUtils.currentUserId());
        return ResponseEntity.ok(Map.of("message", "Project deleted successfully!"));
    }
}
