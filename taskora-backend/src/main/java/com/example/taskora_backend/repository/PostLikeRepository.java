package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.Post;
import com.example.taskora_backend.model.PostLike;
import com.example.taskora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    boolean existsByPostAndUser(Post post, User user);

    void deleteByPostAndUser(Post post, User user);

    long countByPost(Post post);

    @Modifying
    void deleteByUser(User user);
}
