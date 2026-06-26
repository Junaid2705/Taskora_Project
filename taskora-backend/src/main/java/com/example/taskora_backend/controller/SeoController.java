package com.example.taskora_backend.controller;

import com.example.taskora_backend.repository.CmsPageRepository;
import com.example.taskora_backend.repository.JobRepository;
import com.example.taskora_backend.repository.ProjectRepository;
import com.example.taskora_backend.model.Job;
import com.example.taskora_backend.model.Project;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * SEO Module — serves meta info, Open Graph data, and a sitemap.xml
 * for search engine indexing.
 */
@RestController
@RequiredArgsConstructor
public class SeoController {

    private final JobRepository jobRepository;
    private final ProjectRepository projectRepository;
    private final CmsPageRepository cmsPageRepository;

    // Meta info for the site (used by SSR or prerender services)
    @GetMapping("/api/seo/meta")
    public ResponseEntity<?> getMeta() {
        Map<String, String> meta = new LinkedHashMap<>();
        meta.put("title", "Taskora - Freelancer Social Networking Platform");
        meta.put("description", "Connect, collaborate and grow. The ultimate platform for freelancers, employers and professionals.");
        meta.put("keywords", "freelancer, jobs, projects, bidding, portfolio, social network, hiring, remote work");
        meta.put("ogTitle", "Taskora - Connect, Collaborate, Grow");
        meta.put("ogDescription", "The ultimate freelancer platform to find work, hire talent, and build your professional network.");
        meta.put("ogImage", "/logo.png");
        meta.put("ogType", "website");
        meta.put("ogUrl", "http://localhost:5173");
        return ResponseEntity.ok(meta);
    }

    // Sitemap.xml generation
    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> sitemap() {
        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        sb.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        // Static pages
        String base = "http://localhost:5173";
        String[] statics = {"/", "/login", "/register", "/jobs", "/projects"};
        for (String path : statics) {
            sb.append("  <url><loc>").append(base).append(path).append("</loc><priority>0.8</priority></url>\n");
        }

        // CMS pages
        cmsPageRepository.findByStatusTrue().forEach(p ->
            sb.append("  <url><loc>").append(base).append("/page/").append(p.getSlug()).append("</loc><priority>0.5</priority></url>\n")
        );

        // Jobs
        jobRepository.findByStatus(Job.Status.OPEN).forEach(j ->
            sb.append("  <url><loc>").append(base).append("/jobs/").append(j.getJobId()).append("</loc><priority>0.7</priority></url>\n")
        );

        // Projects
        projectRepository.findByProjectStatus(Project.ProjectStatus.OPEN).forEach(p ->
            sb.append("  <url><loc>").append(base).append("/projects/").append(p.getProjectId()).append("</loc><priority>0.7</priority></url>\n")
        );

        sb.append("</urlset>");
        return ResponseEntity.ok(sb.toString());
    }

    // Robots.txt
    @GetMapping(value = "/robots.txt", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> robots() {
        String content = """
                User-agent: *
                Allow: /
                Disallow: /admin
                Disallow: /api/
                Sitemap: http://localhost:5173/sitemap.xml
                """;
        return ResponseEntity.ok(content);
    }
}
