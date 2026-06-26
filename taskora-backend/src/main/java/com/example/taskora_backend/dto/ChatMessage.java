package com.example.taskora_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Wire format for chat. Inbound (client -> server) only needs receiverId + content.
 * Outbound (server -> clients) is fully populated.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private Long messageId;
    private Long senderId;
    private Long receiverId;
    private String senderName;
    private String content;
    private LocalDateTime timestamp;
    private Boolean isRead;
}
