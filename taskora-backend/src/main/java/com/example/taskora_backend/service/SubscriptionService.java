package com.example.taskora_backend.service;

import com.example.taskora_backend.model.Subscription;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.model.UserProfile;
import com.example.taskora_backend.repository.SubscriptionRepository;
import com.example.taskora_backend.repository.UserProfileRepository;
import com.example.taskora_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final NotificationService notificationService;

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
    }

    /** Subscribe to a creator. Uses the creator's set fee from their profile. */
    @Transactional
    public Map<String, Object> subscribe(Long subscriberId, Long creatorId, BigDecimal price) {
        if (subscriberId.equals(creatorId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot subscribe to yourself.");
        }
        User subscriber = getUser(subscriberId);
        User creator = getUser(creatorId);

        if (subscriptionRepository.existsByCreatorAndSubscriberAndStatus(creator, subscriber, Subscription.SubscriptionStatus.ACTIVE)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You already have an active subscription to this creator.");
        }

        // Use creator's set fee if no custom price provided
        BigDecimal finalPrice = price;
        if (finalPrice == null || finalPrice.compareTo(BigDecimal.ZERO) == 0) {
            UserProfile creatorProfile = userProfileRepository.findByUser_UserId(creatorId).orElse(null);
            if (creatorProfile != null && creatorProfile.getSubscriptionFee() != null) {
                finalPrice = creatorProfile.getSubscriptionFee();
            } else {
                finalPrice = BigDecimal.ZERO;
            }
        }

        Subscription sub = new Subscription();
        sub.setCreator(creator);
        sub.setSubscriber(subscriber);
        sub.setMonthlyPrice(finalPrice);
        sub.setStartDate(LocalDate.now());
        sub.setEndDate(LocalDate.now().plusMonths(1));
        sub.setStatus(Subscription.SubscriptionStatus.ACTIVE);
        subscriptionRepository.save(sub);

        // Notify the creator
        notificationService.notify(creatorId, "New Subscriber",
                subscriber.getUsername() + " subscribed to you!");

        return Map.of("message", "Subscribed successfully!", "subscriptionId", sub.getSubscriptionId());
    }

    @Transactional
    public void unsubscribe(Long subscriberId, Long creatorId) {
        User subscriber = getUser(subscriberId);
        User creator = getUser(creatorId);
        Subscription sub = subscriptionRepository.findByCreatorAndSubscriberAndStatus(creator, subscriber, Subscription.SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No active subscription found."));
        sub.setStatus(Subscription.SubscriptionStatus.EXPIRED);
        sub.setEndDate(LocalDate.now());
        subscriptionRepository.save(sub);
    }

    public List<Map<String, Object>> getMySubscriptions(Long subscriberId) {
        User subscriber = getUser(subscriberId);
        return subscriptionRepository.findBySubscriber(subscriber).stream().map(this::toDto).toList();
    }

    public List<Map<String, Object>> getMySubscribers(Long creatorId) {
        User creator = getUser(creatorId);
        return subscriptionRepository.findByCreator(creator).stream().map(this::toDto).toList();
    }

    public long getActiveSubscriberCount(Long creatorId) {
        User creator = getUser(creatorId);
        return subscriptionRepository.countByCreatorAndStatus(creator, Subscription.SubscriptionStatus.ACTIVE);
    }

    private Map<String, Object> toDto(Subscription s) {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("subscriptionId", s.getSubscriptionId());
        dto.put("creatorId", s.getCreator().getUserId());
        dto.put("creatorName", s.getCreator().getFullName() != null ? s.getCreator().getFullName() : s.getCreator().getUsername());
        dto.put("subscriberId", s.getSubscriber().getUserId());
        dto.put("subscriberName", s.getSubscriber().getFullName() != null ? s.getSubscriber().getFullName() : s.getSubscriber().getUsername());
        dto.put("monthlyPrice", s.getMonthlyPrice());
        dto.put("startDate", s.getStartDate());
        dto.put("endDate", s.getEndDate());
        dto.put("status", s.getStatus().name());
        return dto;
    }

    /** Returns all users with CREATOR role along with their subscription fee. */
    public List<Map<String, Object>> getAllCreators() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.CREATOR)
                .map(u -> {
                    Map<String, Object> dto = new LinkedHashMap<>();
                    dto.put("userId", u.getUserId());
                    dto.put("username", u.getUsername());
                    dto.put("fullName", u.getFullName());
                    dto.put("avatarUrl", u.getAvatarUrl());
                    BigDecimal fee = BigDecimal.ZERO;
                    UserProfile profile = userProfileRepository.findByUser_UserId(u.getUserId()).orElse(null);
                    if (profile != null && profile.getSubscriptionFee() != null) {
                        fee = profile.getSubscriptionFee();
                    }
                    dto.put("subscriptionFee", fee);
                    dto.put("subscriberCount", subscriptionRepository.countByCreatorAndStatus(u, Subscription.SubscriptionStatus.ACTIVE));
                    return dto;
                })
                .toList();
    }
}
