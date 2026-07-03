package com.example.taskora_backend.service;

import com.example.taskora_backend.dto.BidRequest;
import com.example.taskora_backend.model.Project;
import com.example.taskora_backend.model.ProjectBid;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.ProjectBidRepository;
import com.example.taskora_backend.repository.ProjectRepository;
import com.example.taskora_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BidService {

    private final ProjectBidRepository bidRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ProjectBid submitBid(BidRequest request, Long freelancerId) {
        if (request.getProjectId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project id is required.");
        }
        Project project = getProject(request.getProjectId());
        User freelancer = getUser(freelancerId);

        if (project.getProjectStatus() != Project.ProjectStatus.OPEN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This project is not open for bidding.");
        }
        if (project.getUser() != null && project.getUser().getUserId().equals(freelancerId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot bid on your own project.");
        }
        if (bidRepository.existsByProjectAndFreelancer(project, freelancer)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already submitted a bid for this project.");
        }

        ProjectBid bid = new ProjectBid();
        bid.setProject(project);
        bid.setFreelancer(freelancer);
        bid.setProposal(request.getProposal());
        bid.setBidAmount(request.getBidAmount());
        bid.setDeliveryDays(request.getDeliveryDays());
        bid.setStatus(ProjectBid.BidStatus.PENDING);
        bidRepository.save(bid);

        // Notify the project owner about the new bid
        if (project.getUser() != null) {
            notificationService.notify(project.getUser().getUserId(), "New Bid",
                    freelancer.getUsername() + " placed a bid on \"" + project.getProjectTitle() + "\".");
        }
        return bid;
    }

    public ProjectBid updateBid(Long bidId, BidRequest request, Long freelancerId) {
        ProjectBid bid = getBid(bidId);
        ensureBidOwner(bid, freelancerId);
        if (bid.getStatus() != ProjectBid.BidStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only pending bids can be updated.");
        }
        bid.setProposal(request.getProposal());
        bid.setBidAmount(request.getBidAmount());
        bid.setDeliveryDays(request.getDeliveryDays());
        return bidRepository.save(bid);
    }

    public void withdrawBid(Long bidId, Long freelancerId) {
        ProjectBid bid = getBid(bidId);
        ensureBidOwner(bid, freelancerId);
        bidRepository.delete(bid);
    }

    public List<ProjectBid> getBidsForProject(Long projectId, Long requesterId) {
        Project project = getProject(projectId);
        ensureProjectOwner(project, requesterId);
        return bidRepository.findByProject(project);
    }

    public List<ProjectBid> getMyBids(Long freelancerId) {
        return bidRepository.findByFreelancer(getUser(freelancerId));
    }

    /** Check if a user has already bid on a project. */
    public boolean hasBid(Long projectId, Long freelancerId) {
        Project project = getProject(projectId);
        User freelancer = getUser(freelancerId);
        return bidRepository.existsByProjectAndFreelancer(project, freelancer);
    }

    /** Project owner accepts a bid: it becomes ACCEPTED, all others REJECTED, project moves to IN_PROGRESS. */
    @Transactional
    public ProjectBid acceptBid(Long bidId, Long ownerId) {
        ProjectBid bid = getBid(bidId);
        Project project = bid.getProject();
        ensureProjectOwner(project, ownerId);

        for (ProjectBid other : bidRepository.findByProject(project)) {
            other.setStatus(other.getBidId().equals(bidId)
                    ? ProjectBid.BidStatus.ACCEPTED
                    : ProjectBid.BidStatus.REJECTED);
            bidRepository.save(other);
        }
        project.setProjectStatus(Project.ProjectStatus.IN_PROGRESS);
        projectRepository.save(project);

        // Notify the winner
        ProjectBid accepted = getBid(bidId);
        if (accepted.getFreelancer() != null) {
            notificationService.notify(accepted.getFreelancer().getUserId(), "Bid Accepted! 🎉",
                    "Your bid on \"" + project.getProjectTitle() + "\" has been accepted.");
        }
        return accepted;
    }

    public ProjectBid rejectBid(Long bidId, Long ownerId) {
        ProjectBid bid = getBid(bidId);
        ensureProjectOwner(bid.getProject(), ownerId);
        bid.setStatus(ProjectBid.BidStatus.REJECTED);
        return bidRepository.save(bid);
    }

    // --- helpers ---

    private void ensureBidOwner(ProjectBid bid, Long freelancerId) {
        if (bid.getFreelancer() == null || !bid.getFreelancer().getUserId().equals(freelancerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage your own bids.");
        }
    }

    private void ensureProjectOwner(Project project, Long ownerId) {
        if (project.getUser() == null || !project.getUser().getUserId().equals(ownerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the project owner can perform this action.");
        }
    }

    private ProjectBid getBid(Long id) {
        return bidRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bid not found."));
    }

    private Project getProject(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found."));
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
    }
}
