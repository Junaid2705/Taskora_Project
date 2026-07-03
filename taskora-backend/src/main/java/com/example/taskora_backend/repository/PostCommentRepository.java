package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.Post;
import com.example.taskora_backend.model.PostComment;
import com.example.taskora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    List<PostComment> findByPostOrderByCreatedAtAsc(Post post);

    long countByPost(Post post);

    @Modifying
    void deleteByUser(User user);
}
