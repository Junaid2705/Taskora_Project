package com.example.taskora_backend.controller;

import com.example.taskora_backend.dto.ChatMessage;
import com.example.taskora_backend.model.Message;
import com.example.taskora_backend.security.AuthUtils;
import com.example.taskora_backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final com.example.taskora_backend.service.FileStorageService fileStorageService;

    // Send a message (persists, then pushes to the recipient over WebSocket)
    @PostMapping("/send/{receiverId}")
    public ResponseEntity<?> sendMessage(@PathVariable Long receiverId, @RequestBody Map<String, String> payload) {
        Message saved = messageService.save(AuthUtils.currentUserId(), receiverId, payload.get("content"));
        ChatMessage dto = messageService.toDto(saved);
        // Real-time delivery to the recipient's personal queue.
        messagingTemplate.convertAndSendToUser(saved.getReceiver().getUsername(), "/queue/messages", dto);
        return ResponseEntity.ok(dto);
    }

    // Conversation history with another user (also marks their messages as read)
    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<List<ChatMessage>> getConversation(@PathVariable Long otherUserId) {
        return ResponseEntity.ok(messageService.conversation(AuthUtils.currentUserId(), otherUserId));
    }

    // Users the current user has chatted with (includes unread count per contact)
    @GetMapping("/contacts")
    public ResponseEntity<?> getContacts() {
        Long me = AuthUtils.currentUserId();
        List<?> partners = (List<?>) messageService.contacts(me);
        // Enrich each contact with their unread count
        List<java.util.Map<String, Object>> enriched = new java.util.ArrayList<>();
        for (Object p : partners) {
            if (p instanceof com.example.taskora_backend.model.User u) {
                java.util.Map<String, Object> map = new java.util.LinkedHashMap<>();
                map.put("userId", u.getUserId());
                map.put("username", u.getUsername());
                map.put("fullName", u.getFullName());
                map.put("avatarUrl", u.getAvatarUrl());
                map.put("unread", messageService.unreadFrom(me, u.getUserId()));
                enriched.add(map);
            }
        }
        return ResponseEntity.ok(enriched);
    }

    // Total unread messages (for a topbar badge)
    @GetMapping("/unread-count")
    public ResponseEntity<?> unreadCount() {
        return ResponseEntity.ok(Map.of("count", messageService.unreadCount(AuthUtils.currentUserId())));
    }

    // Explicitly mark a conversation as read
    @PutMapping("/read/{otherUserId}")
    public ResponseEntity<?> markRead(@PathVariable Long otherUserId) {
        messageService.markRead(AuthUtils.currentUserId(), otherUserId);
        return ResponseEntity.ok(Map.of("message", "ok"));
    }

    // Edit a message (sender only)
    @PutMapping("/{messageId}")
    public ResponseEntity<?> editMessage(@PathVariable Long messageId, @RequestBody Map<String, String> payload) {
        ChatMessage updated = messageService.editMessage(messageId, AuthUtils.currentUserId(), payload.get("content"));
        return ResponseEntity.ok(updated);
    }

    // Delete a message (sender only)
    @DeleteMapping("/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long messageId) {
        messageService.deleteMessage(messageId, AuthUtils.currentUserId());
        return ResponseEntity.ok(Map.of("message", "Message deleted."));
    }

    // Upload a file for chat (images/attachments)
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String url = fileStorageService.store(file, "chat");
        return ResponseEntity.ok(Map.of("url", url));
    }
}
