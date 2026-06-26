package com.example.taskora_backend.controller;

import com.example.taskora_backend.security.AuthUtils;
import com.example.taskora_backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<?> getRecent(@RequestParam(defaultValue = "30") int size) {
        return ResponseEntity.ok(notificationService.getRecent(AuthUtils.currentUserId(), size));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> unreadCount() {
        return ResponseEntity.ok(Map.of("count", notificationService.unreadCount(AuthUtils.currentUserId())));
    }

    @PutMapping("/mark-read")
    public ResponseEntity<?> markRead() {
        notificationService.markAllRead(AuthUtils.currentUserId());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read."));
    }
}
