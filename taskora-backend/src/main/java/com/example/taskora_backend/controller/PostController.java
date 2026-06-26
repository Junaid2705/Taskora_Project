package com.example.taskora_backend.controller;

import com.example.taskora_backend.security.AuthUtils;
import com.example.taskora_backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // Feed (paginated)
    @GetMapping("/feed")
    public ResponseEntity<?> getFeed(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(postService.getFeed(page, size, AuthUtils.currentUserId()));
    }

    // Posts by a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserPosts(@PathVariable Long userId) {
        return ResponseEntity.ok(postService.getUserPosts(userId, AuthUtils.currentUserId()));
    }

    // Create a post (content and/or image)
    @PostMapping
    public ResponseEntity<?> create(
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(postService.create(AuthUtils.currentUserId(), content, image));
    }

    // Edit post content
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(postService.update(id, AuthUtils.currentUserId(), body.get("content")));
    }

    // Delete (soft)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        postService.delete(id, AuthUtils.currentUserId());
        return ResponseEntity.ok(Map.of("message", "Post deleted."));
    }

    // Toggle like
    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id) {
        return ResponseEntity.ok(postService.toggleLike(id, AuthUtils.currentUserId()));
    }

    // Get comments
    @GetMapping("/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getComments(id));
    }

    // Add comment
    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(postService.addComment(id, AuthUtils.currentUserId(), body.get("comment")));
    }
}
