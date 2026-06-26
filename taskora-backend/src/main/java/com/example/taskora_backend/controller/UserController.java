package com.example.taskora_backend.controller;

import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.UserRepository;
import com.example.taskora_backend.security.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // Directory search used to start new conversations.
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> search(@RequestParam("q") String q) {
        if (q == null || q.trim().length() < 1) {
            return ResponseEntity.ok(List.of());
        }
        List<Map<String, Object>> results = userRepository
                .searchUsers(q.trim(), AuthUtils.currentUserId(), PageRequest.of(0, 10))
                .stream()
                .map(this::toSummary)
                .toList();
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        return ResponseEntity.ok(toSummary(u));
    }

    private Map<String, Object> toSummary(User u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("userId", u.getUserId());
        m.put("username", u.getUsername());
        m.put("fullName", u.getFullName());
        m.put("avatarUrl", u.getAvatarUrl());
        m.put("role", u.getRole() != null ? u.getRole().name() : null);
        return m;
    }
}
