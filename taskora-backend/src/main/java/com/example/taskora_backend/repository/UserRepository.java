package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    // Directory search used to start new conversations (excludes the caller)
    @Query("SELECT u FROM User u WHERE u.userId <> :selfId AND "
            + "(LOWER(u.username) LIKE LOWER(CONCAT('%', :q, '%')) "
            + " OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<User> searchUsers(@Param("q") String q, @Param("selfId") Long selfId, Pageable pageable);

    long countByRole(User.Role role);
}
