package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.UserVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserVerificationRepository extends JpaRepository<UserVerification, Long> {

    List<UserVerification> findByUser_UserId(Long userId);

    List<UserVerification> findByStatus(UserVerification.VerificationStatus status);
}
