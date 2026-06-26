package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.Post;
import com.example.taskora_backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Feed: all active posts, newest first (paginated for infinite scroll)
    Page<Post> findByStatusTrueOrderByCreatedAtDesc(Pageable pageable);

    // Posts by a specific user
    List<Post> findByUserAndStatusTrueOrderByCreatedAtDesc(User user);
}
