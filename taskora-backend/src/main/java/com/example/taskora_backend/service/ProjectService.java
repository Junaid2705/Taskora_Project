package com.example.taskora_backend.service;

import com.example.taskora_backend.dto.ProjectRequest;
import com.example.taskora_backend.model.Category;
import com.example.taskora_backend.model.Project;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.CategoryRepository;
import com.example.taskora_backend.repository.ProjectRepository;
import com.example.taskora_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<Project> getOpenProjects() {
        return projectRepository.findByProjectStatus(Project.ProjectStatus.OPEN);
    }

    public List<Project> search(String keyword, Long categoryId, BigDecimal minBudget, BigDecimal maxBudget) {
        String k = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        return projectRepository.search(Project.ProjectStatus.OPEN, k, categoryId, minBudget, maxBudget);
    }

    public Project getById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found."));
    }

    public List<Project> getMyProjects(Long ownerId) {
        return projectRepository.findByUser(getUser(ownerId));
    }

    public Project create(ProjectRequest request, Long ownerId) {
        User owner = getUser(ownerId);
        Project project = new Project();
        project.setUser(owner);
        applyRequest(project, request);
        project.setProjectStatus(Project.ProjectStatus.OPEN);
        return projectRepository.save(project);
    }

    public Project update(Long projectId, ProjectRequest request, Long ownerId) {
        Project project = getById(projectId);
        ensureOwner(project, ownerId);
        applyRequest(project, request);
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            project.setProjectStatus(parseStatus(request.getStatus()));
        }
        return projectRepository.save(project);
    }

    public void delete(Long projectId, Long ownerId) {
        Project project = getById(projectId);
        ensureOwner(project, ownerId);
        projectRepository.delete(project);
    }

    // --- helpers ---

    private void applyRequest(Project project, ProjectRequest request) {
        project.setProjectTitle(request.getProjectTitle());
        project.setDescription(request.getDescription());
        project.setBudget(request.getBudget());
        project.setDuration(request.getDuration());
        if (request.getCategoryId() != null) {
            project.setCategory(getCategory(request.getCategoryId()));
        }
    }

    private void ensureOwner(Project project, Long ownerId) {
        if (project.getUser() == null || !project.getUser().getUserId().equals(ownerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage your own projects.");
        }
    }

    private Project.ProjectStatus parseStatus(String status) {
        try {
            return Project.ProjectStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid status. Use OPEN, IN_PROGRESS or COMPLETED.");
        }
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
    }

    private Category getCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found."));
    }
}
