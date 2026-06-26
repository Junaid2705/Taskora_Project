package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.Subscription;
import com.example.taskora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findByCreator(User creator);

    List<Subscription> findBySubscriber(User subscriber);

    Optional<Subscription> findByCreatorAndSubscriberAndStatus(User creator, User subscriber, Subscription.SubscriptionStatus status);

    Optional<Subscription> findByCreatorAndSubscriber(User creator, User subscriber);

    boolean existsByCreatorAndSubscriberAndStatus(User creator, User subscriber, Subscription.SubscriptionStatus status);

    long countByCreatorAndStatus(User creator, Subscription.SubscriptionStatus status);

    long countByStatus(Subscription.SubscriptionStatus status);
}
