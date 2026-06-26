package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.Project;
import com.example.taskora_backend.model.ProjectBid;
import com.example.taskora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectBidRepository extends JpaRepository<ProjectBid, Long> {

    List<ProjectBid> findByProject(Project project);

    List<ProjectBid> findByFreelancer(User freelancer);

    boolean existsByProjectAndFreelancer(Project project, User freelancer);
}
