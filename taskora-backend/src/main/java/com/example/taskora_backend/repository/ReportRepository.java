package com.example.taskora_backend.repository;

import com.example.taskora_backend.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByStatus(Report.ReportStatus status);

    List<Report> findByReportedBy_UserId(Long userId);
}
