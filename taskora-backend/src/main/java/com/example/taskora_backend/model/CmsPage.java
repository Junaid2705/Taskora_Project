package com.example.taskora_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cms_pages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CmsPage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "page_id")
    private Long pageId;

    @Column(length = 255)
    private String title;

    @Column(length = 255)
    private String slug;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @Column(columnDefinition = "boolean default true")
    private Boolean status = true;
}