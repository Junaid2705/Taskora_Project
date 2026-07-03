package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.Report;
import com.example.taskora_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByStatus(Report.ReportStatus status);

    List<Report> findByReportedBy_UserId(Long userId);

    @Modifying
    void deleteByReportedBy(User reportedBy);

    @Modifying
    void deleteByTarget(User target);
}
