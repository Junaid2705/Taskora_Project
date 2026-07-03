package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.UserProfile;
import com.example.taskora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByUser_UserId(Long userId);

    @Modifying
    void deleteByUser(User user);
}
