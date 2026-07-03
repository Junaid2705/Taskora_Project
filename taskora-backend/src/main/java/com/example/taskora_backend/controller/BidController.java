package com.example.taskora_backend.controller;

import com.example.taskora_backend.dto.BidRequest;
import com.example.taskora_backend.model.ProjectBid;
import com.example.taskora_backend.security.AuthUtils;
import com.example.taskora_backend.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    // Freelancer submits a bid
    @PostMapping
    public ResponseEntity<?> submitBid(@Valid @RequestBody BidRequest request) {
        ProjectBid bid = bidService.submitBid(request, AuthUtils.currentUserId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Bid submitted successfully!", "bidId", bid.getBidId().toString()));
    }

    // Freelancer updates their own pending bid
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBid(@PathVariable Long id, @Valid @RequestBody BidRequest request) {
        bidService.updateBid(id, request, AuthUtils.currentUserId());
        return ResponseEntity.ok(Map.of("message", "Bid updated successfully!"));
    }

    // Freelancer withdraws their own bid
    @DeleteMapping("/{id}")
    public ResponseEntity<?> withdrawBid(@PathVariable Long id) {
        bidService.withdrawBid(id, AuthUtils.currentUserId());
        return ResponseEntity.ok(Map.of("message", "Bid withdrawn successfully!"));
    }

    // Project owner views all bids on a project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectBid>> getBidsForProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(bidService.getBidsForProject(projectId, AuthUtils.currentUserId()));
    }

    // Freelancer views their own bids
    @GetMapping("/my-bids")
    public ResponseEntity<List<ProjectBid>> getMyBids() {
        return ResponseEntity.ok(bidService.getMyBids(AuthUtils.currentUserId()));
    }

    // Check if current user has already bid on a project
    @GetMapping("/check/{projectId}")
    public ResponseEntity<?> hasBid(@PathVariable Long projectId) {
        boolean hasBid = bidService.hasBid(projectId, AuthUtils.currentUserId());
        return ResponseEntity.ok(Map.of("bid", hasBid));
    }

    // Project owner accepts a bid
    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptBid(@PathVariable Long id) {
        bidService.acceptBid(id, AuthUtils.currentUserId());
        return ResponseEntity.ok(Map.of("message", "Bid accepted. Project moved to IN_PROGRESS."));
    }

    // Project owner rejects a bid
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectBid(@PathVariable Long id) {
        bidService.rejectBid(id, AuthUtils.currentUserId());
        return ResponseEntity.ok(Map.of("message", "Bid rejected."));
    }
}
