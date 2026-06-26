package com.example.taskora_backend.service;

import com.example.taskora_backend.model.*;
import com.example.taskora_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostLikeRepository likeRepository;
    private final PostCommentRepository commentRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
    }

    private Post getPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));
    }

    // ---- Feed ----

    public List<Map<String, Object>> getFeed(int page, int size, Long viewerId) {
        return postRepository.findByStatusTrueOrderByCreatedAtDesc(PageRequest.of(page, size))
                .getContent().stream()
                .map(p -> toDto(p, viewerId))
                .toList();
    }

    public List<Map<String, Object>> getUserPosts(Long userId, Long viewerId) {
        User owner = getUser(userId);
        return postRepository.findByUserAndStatusTrueOrderByCreatedAtDesc(owner)
                .stream().map(p -> toDto(p, viewerId)).toList();
    }

    // ---- Create / Edit / Delete ----

    @Transactional
    public Map<String, Object> create(Long userId, String content, MultipartFile image) {
        if ((content == null || content.isBlank()) && (image == null || image.isEmpty())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post must have content or an image.");
        }
        User user = getUser(userId);
        Post post = new Post();
        post.setUser(user);
        post.setContent(content != null ? content.trim() : null);
        if (image != null && !image.isEmpty()) {
            post.setImageUrl(fileStorageService.store(image, "post"));
        }
        postRepository.save(post);
        return toDto(post, userId);
    }

    @Transactional
    public Map<String, Object> update(Long postId, Long userId, String content) {
        Post post = getPost(postId);
        ensureOwner(post, userId);
        if (content != null) post.setContent(content.trim());
        postRepository.save(post);
        return toDto(post, userId);
    }

    @Transactional
    public void delete(Long postId, Long userId) {
        Post post = getPost(postId);
        ensureOwner(post, userId);
        post.setStatus(false); // soft-delete
        postRepository.save(post);
    }

    // ---- Likes ----

    @Transactional
    public Map<String, Object> toggleLike(Long postId, Long userId) {
        Post post = getPost(postId);
        User user = getUser(userId);
        boolean liked;
        if (likeRepository.existsByPostAndUser(post, user)) {
            likeRepository.deleteByPostAndUser(post, user);
            liked = false;
        } else {
            PostLike like = new PostLike();
            like.setPost(post);
            like.setUser(user);
            likeRepository.save(like);
            liked = true;
            // Notify the post owner (skip if they liked their own post)
            if (!post.getUser().getUserId().equals(userId)) {
                notificationService.notify(post.getUser().getUserId(), "New Like",
                        user.getUsername() + " liked your post.");
            }
        }
        long count = likeRepository.countByPost(post);
        return Map.of("liked", liked, "likeCount", count);
    }

    // ---- Comments ----

    @Transactional
    public Map<String, Object> addComment(Long postId, Long userId, String text) {
        if (text == null || text.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment cannot be empty.");
        }
        Post post = getPost(postId);
        User user = getUser(userId);
        PostComment comment = new PostComment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setComment(text.trim());
        commentRepository.save(comment);

        // Notify the post owner (skip if they commented on their own post)
        if (!post.getUser().getUserId().equals(userId)) {
            notificationService.notify(post.getUser().getUserId(), "New Comment",
                    user.getUsername() + " commented on your post.");
        }

        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("commentId", comment.getCommentId());
        dto.put("userId", user.getUserId());
        dto.put("username", user.getUsername());
        dto.put("fullName", user.getFullName());
        dto.put("avatarUrl", user.getAvatarUrl());
        dto.put("comment", comment.getComment());
        dto.put("createdAt", comment.getCreatedAt());
        return dto;
    }

    public List<Map<String, Object>> getComments(Long postId) {
        Post post = getPost(postId);
        return commentRepository.findByPostOrderByCreatedAtAsc(post).stream().map(c -> {
            Map<String, Object> dto = new LinkedHashMap<>();
            dto.put("commentId", c.getCommentId());
            dto.put("userId", c.getUser().getUserId());
            dto.put("username", c.getUser().getUsername());
            dto.put("fullName", c.getUser().getFullName());
            dto.put("avatarUrl", c.getUser().getAvatarUrl());
            dto.put("comment", c.getComment());
            dto.put("createdAt", c.getCreatedAt());
            return dto;
        }).toList();
    }

    // ---- helpers ----

    private void ensureOwner(Post post, Long userId) {
        if (post.getUser() == null || !post.getUser().getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage your own posts.");
        }
    }

    private Map<String, Object> toDto(Post p, Long viewerId) {
        User viewer = viewerId != null ? getUser(viewerId) : null;
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("postId", p.getPostId());
        dto.put("userId", p.getUser().getUserId());
        dto.put("username", p.getUser().getUsername());
        dto.put("fullName", p.getUser().getFullName());
        dto.put("avatarUrl", p.getUser().getAvatarUrl());
        dto.put("content", p.getContent());
        dto.put("imageUrl", p.getImageUrl());
        dto.put("createdAt", p.getCreatedAt());
        dto.put("likeCount", likeRepository.countByPost(p));
        dto.put("commentCount", commentRepository.countByPost(p));
        dto.put("liked", viewer != null && likeRepository.existsByPostAndUser(p, viewer));
        return dto;
    }
}
