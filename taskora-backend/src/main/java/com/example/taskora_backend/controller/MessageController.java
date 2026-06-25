package com.example.taskora_backend.controller;

import com.example.taskora_backend.model.Message;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.MessageRepository;
import com.example.taskora_backend.repository.UserRepository;
import com.example.taskora_backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    // 1. Send a new message
    @PostMapping("/send/{receiverId}")
    public ResponseEntity<?> sendMessage(@PathVariable Long receiverId, @RequestBody Map<String, String> payload) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User sender = userRepository.findById(userDetails.getId()).orElseThrow();
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message newMessage = new Message();
        newMessage.setSender(sender);
        newMessage.setReceiver(receiver);
        
        // Using your exact field name: 'message' instead of 'content'
        newMessage.setMessage(payload.get("content"));

        messageRepository.save(newMessage);

        return ResponseEntity.ok(Map.of("message", "Message sent successfully!"));
    }

    // 2. Get the chat history with a specific user
    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<?> getConversation(@PathVariable Long otherUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long myId = ((UserDetailsImpl) authentication.getPrincipal()).getId();

        List<Message> history = messageRepository.findConversation(myId, otherUserId);
        
     // Format the response cleanly for React
        List<Map<String, Object>> formattedHistory = history.stream().map(m -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("messageId", m.getMessageId());
            map.put("senderId", m.getSender().getUserId());
            map.put("content", m.getMessage());
            map.put("timestamp", m.getSentAt());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(formattedHistory);
    }

    // 3. Get a list of users we have active chats with
    @GetMapping("/contacts")
    public ResponseEntity<?> getContacts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long myId = ((UserDetailsImpl) authentication.getPrincipal()).getId();

        List<Object> partners = messageRepository.findChatPartners(myId);
        
        // We return basic user details for the sidebar contact list
        return ResponseEntity.ok(partners);
    }
}