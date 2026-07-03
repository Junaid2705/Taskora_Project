package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.Message;
import com.example.taskora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // Custom query to get the full conversation history between two specific users
    @Query("SELECT m FROM Message m WHERE (m.sender.userId = :user1 AND m.receiver.userId = :user2) " +
           "OR (m.sender.userId = :user2 AND m.receiver.userId = :user1) ORDER BY m.sentAt ASC")
    List<Message> findConversation(@Param("user1") Long user1, @Param("user2") Long user2);

    // Find all users that the current user has chatted with
    @Query("SELECT DISTINCT u FROM User u WHERE u.userId IN " +
           "(SELECT m.receiver.userId FROM Message m WHERE m.sender.userId = :userId) OR " +
           "u.userId IN (SELECT m.sender.userId FROM Message m WHERE m.receiver.userId = :userId)")
    List<Object> findChatPartners(@Param("userId") Long userId);

    // Mark all messages from :other to :me as read (called when opening a chat)
    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.isRead = true WHERE m.receiver.userId = :me " +
           "AND m.sender.userId = :other AND m.isRead = false")
    int markConversationRead(@Param("me") Long me, @Param("other") Long other);

    // Total unread messages for the current user
    long countByReceiver_UserIdAndIsReadFalse(Long userId);

    // Unread count from a specific sender (for per-contact badges)
    long countByReceiver_UserIdAndSender_UserIdAndIsReadFalse(Long me, Long other);

    @Modifying
    @Transactional
    void deleteBySender(User sender);

    @Modifying
    @Transactional
    void deleteByReceiver(User receiver);
}