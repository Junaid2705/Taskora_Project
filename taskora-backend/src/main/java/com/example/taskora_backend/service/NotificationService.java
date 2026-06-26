package com.example.taskora_backend.service;

import com.example.taskora_backend.model.Notification;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.NotificationRepository;
import com.example.taskora_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Creates notifications and optionally pushes them in real-time over WebSocket.
 * Call notify() from any service that triggers a notifiable event.
 */
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /** Create + push a notification. */
    @Transactional
    public Notification notify(Long recipientId, String title, String description) {
        User user = userRepository.findById(recipientId).orElse(null);
        if (user == null) return null;

        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setDescription(description);
        notificationRepository.save(n);

        // Push over WebSocket to the user's personal queue
        Map<String, Object> payload = toDto(n);
        messagingTemplate.convertAndSendToUser(user.getUsername(), "/queue/notifications", payload);
        return n;
    }

    public List<Map<String, Object>> getRecent(Long userId, int size) {
        return notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, size))
                .stream().map(this::toDto).toList();
    }

    public long unreadCount(Long userId) {
        return notificationRepository.countByUser_UserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAllRead(Long userId) {
        notificationRepository.markAllRead(userId);
    }

    private Map<String, Object> toDto(Notification n) {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("notificationId", n.getNotificationId());
        dto.put("title", n.getTitle());
        dto.put("description", n.getDescription());
        dto.put("isRead", n.getIsRead());
        dto.put("createdAt", n.getCreatedAt());
        return dto;
    }
}
