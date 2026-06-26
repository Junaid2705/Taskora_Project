package com.example.taskora_backend.controller;

import com.example.taskora_backend.model.UserProfile;
import com.example.taskora_backend.repository.UserProfileRepository;
import com.example.taskora_backend.security.AuthUtils;
import com.example.taskora_backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UserProfileRepository userProfileRepository;

    // Subscribe to a creator
    @PostMapping("/subscribe/{creatorId}")
    public ResponseEntity<?> subscribe(@PathVariable Long creatorId,
                                       @RequestBody(required = false) Map<String, Object> body) {
        BigDecimal price = null;
        if (body != null && body.get("monthlyPrice") != null) {
            price = new BigDecimal(body.get("monthlyPrice").toString());
        }
        return ResponseEntity.ok(subscriptionService.subscribe(AuthUtils.currentUserId(), creatorId, price));
    }

    // Unsubscribe
    @PostMapping("/unsubscribe/{creatorId}")
    public ResponseEntity<?> unsubscribe(@PathVariable Long creatorId) {
        subscriptionService.unsubscribe(AuthUtils.currentUserId(), creatorId);
        return ResponseEntity.ok(Map.of("message", "Unsubscribed successfully."));
    }

    // My subscriptions (as a subscriber)
    @GetMapping("/my-subscriptions")
    public ResponseEntity<?> mySubscriptions() {
        return ResponseEntity.ok(subscriptionService.getMySubscriptions(AuthUtils.currentUserId()));
    }

    // My subscribers (as a creator)
    @GetMapping("/my-subscribers")
    public ResponseEntity<?> mySubscribers() {
        return ResponseEntity.ok(subscriptionService.getMySubscribers(AuthUtils.currentUserId()));
    }

    // Active subscriber count for a creator
    @GetMapping("/count/{creatorId}")
    public ResponseEntity<?> subscriberCount(@PathVariable Long creatorId) {
        return ResponseEntity.ok(Map.of("count", subscriptionService.getActiveSubscriberCount(creatorId)));
    }

    // Public: List all creators with their subscription fees
    @GetMapping("/creators")
    public ResponseEntity<?> listCreators() {
        return ResponseEntity.ok(subscriptionService.getAllCreators());
    }

    // ============ Creator Plan Management ============

    // Creator: Get their subscription fee
    @GetMapping("/plans")
    public ResponseEntity<?> getMyPlan() {
        Long userId = AuthUtils.currentUserId();
        UserProfile profile = userProfileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found. Please complete your profile first."));
        BigDecimal fee = profile.getSubscriptionFee() != null ? profile.getSubscriptionFee() : BigDecimal.ZERO;
        return ResponseEntity.ok(Map.of("subscriptionFee", fee));
    }

    // Creator: Create/set their subscription plan (sets monthly price)
    @PostMapping("/plans")
    public ResponseEntity<?> createPlan(@RequestBody Map<String, Object> body) {
        Long userId = AuthUtils.currentUserId();
        UserProfile profile = userProfileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found. Please complete your profile first."));

        BigDecimal fee = extractFee(body);
        profile.setSubscriptionFee(fee);
        userProfileRepository.save(profile);

        return ResponseEntity.ok(Map.of("message", "Subscription plan created.", "subscriptionFee", fee));
    }

    // Creator: Update their plan pricing
    @PutMapping("/plans")
    public ResponseEntity<?> updatePlan(@RequestBody Map<String, Object> body) {
        Long userId = AuthUtils.currentUserId();
        UserProfile profile = userProfileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found."));

        BigDecimal fee = extractFee(body);
        profile.setSubscriptionFee(fee);
        userProfileRepository.save(profile);

        return ResponseEntity.ok(Map.of("message", "Subscription plan updated.", "subscriptionFee", fee));
    }

    // Creator: Delete/deactivate plan (set fee to null/zero)
    @DeleteMapping("/plans")
    public ResponseEntity<?> deletePlan() {
        Long userId = AuthUtils.currentUserId();
        UserProfile profile = userProfileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found."));

        profile.setSubscriptionFee(null);
        userProfileRepository.save(profile);

        return ResponseEntity.ok(Map.of("message", "Subscription plan deactivated."));
    }

    private BigDecimal extractFee(Map<String, Object> body) {
        if (body == null || body.get("subscriptionFee") == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "subscriptionFee is required.");
        }
        BigDecimal fee = new BigDecimal(body.get("subscriptionFee").toString());
        if (fee.compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fee cannot be negative.");
        }
        return fee;
    }
}
