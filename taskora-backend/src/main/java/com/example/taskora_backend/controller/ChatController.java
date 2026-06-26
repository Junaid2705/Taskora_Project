package com.example.taskora_backend.controller;

import com.example.taskora_backend.dto.ChatMessage;
import com.example.taskora_backend.model.Message;
import com.example.taskora_backend.security.UserDetailsImpl;
import com.example.taskora_backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * Handles real-time chat over STOMP. Clients send to /app/chat.send and the
 * saved message is pushed to both participants' personal queues
 * (/user/queue/messages).
 */
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void send(@Payload ChatMessage incoming, Principal principal) {
        if (principal == null) {
            return; // unauthenticated socket; ignore
        }
        UserDetailsImpl me = (UserDetailsImpl) ((Authentication) principal).getPrincipal();

        Message saved = messageService.save(me.getId(), incoming.getReceiverId(), incoming.getContent());
        ChatMessage out = messageService.toDto(saved);

        // Deliver to the recipient and echo back to the sender so both UIs update live.
        messagingTemplate.convertAndSendToUser(saved.getReceiver().getUsername(), "/queue/messages", out);
        messagingTemplate.convertAndSendToUser(saved.getSender().getUsername(), "/queue/messages", out);
    }
}
