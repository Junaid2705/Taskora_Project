package com.example.taskora_backend.service;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Tracks which users are currently connected via WebSocket.
 * The WebSocket event listener adds/removes users on connect/disconnect.
 */
@Service
public class PresenceService {

    // Stores usernames of connected users
    private final Set<String> onlineUsers = ConcurrentHashMap.newKeySet();

    public void userConnected(String username) {
        if (username != null) onlineUsers.add(username);
    }

    public void userDisconnected(String username) {
        if (username != null) onlineUsers.remove(username);
    }

    public boolean isOnline(String username) {
        return username != null && onlineUsers.contains(username);
    }

    public Set<String> getOnlineUsers() {
        return Collections.unmodifiableSet(onlineUsers);
    }
}
