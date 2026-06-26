package com.example.taskora_backend.service;

import com.example.taskora_backend.dto.ChatMessage;
import com.example.taskora_backend.model.Message;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.MessageRepository;
import com.example.taskora_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
    }

    /** Persists a message and returns it (with sender/receiver loaded). */
    @Transactional
    public Message save(Long senderId, Long receiverId, String content) {
        if (content == null || content.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message content is required.");
        }
        if (senderId.equals(receiverId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot message yourself.");
        }
        User sender = getUser(senderId);
        User receiver = getUser(receiverId);

        Message m = new Message();
        m.setSender(sender);
        m.setReceiver(receiver);
        m.setMessage(content.trim());
        m.setIsRead(false);
        messageRepository.save(m);

        // Fire a notification to the receiver
        notificationService.notify(receiverId, "New Message",
                sender.getUsername() + " sent you a message.");

        return m;
    }

    /** Conversation history between two users; marks the other user's messages as read. */
    @Transactional
    public List<ChatMessage> conversation(Long me, Long other) {
        messageRepository.markConversationRead(me, other);
        return messageRepository.findConversation(me, other).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public void markRead(Long me, Long other) {
        messageRepository.markConversationRead(me, other);
    }

    public List<Object> contacts(Long me) {
        return messageRepository.findChatPartners(me);
    }

    /** Returns the number of unread messages FROM a specific user TO me. */
    public long unreadFrom(Long me, Long fromUserId) {
        return messageRepository.countByReceiver_UserIdAndSender_UserIdAndIsReadFalse(me, fromUserId);
    }

    public long unreadCount(Long me) {
        return messageRepository.countByReceiver_UserIdAndIsReadFalse(me);
    }

    public ChatMessage toDto(Message m) {
        return new ChatMessage(
                m.getMessageId(),
                m.getSender().getUserId(),
                m.getReceiver().getUserId(),
                m.getSender().getUsername(),
                m.getMessage(),
                m.getSentAt(),
                m.getIsRead()
        );
    }

    /** Edit a message (sender only). */
    @Transactional
    public ChatMessage editMessage(Long messageId, Long userId, String newContent) {
        if (newContent == null || newContent.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message content cannot be empty.");
        }
        Message m = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found."));
        if (!m.getSender().getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only edit your own messages.");
        }
        m.setMessage(newContent.trim());
        messageRepository.save(m);
        return toDto(m);
    }

    /** Delete a message (sender only). */
    @Transactional
    public void deleteMessage(Long messageId, Long userId) {
        Message m = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found."));
        if (!m.getSender().getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own messages.");
        }
        messageRepository.delete(m);
    }
}
