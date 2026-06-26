package com.example.taskora_backend.controller;

import com.example.taskora_backend.service.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/presence")
@RequiredArgsConstructor
public class PresenceController {

    private final PresenceService presenceService;

    // Get all online usernames
    @GetMapping("/online")
    public ResponseEntity<?> getOnlineUsers() {
        Set<String> online = presenceService.getOnlineUsers();
        return ResponseEntity.ok(Map.of("online", online, "count", online.size()));
    }

    // Check if a specific user is online
    @GetMapping("/status/{username}")
    public ResponseEntity<?> isOnline(@PathVariable String username) {
        return ResponseEntity.ok(Map.of("username", username, "online", presenceService.isOnline(username)));
    }
}
