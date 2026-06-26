package com.example.taskora_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files from the local "uploads" folder at /uploads/**.
        // Using Path.toUri() produces a correctly-encoded file:/// URI that works
        // even when the absolute path contains spaces or Windows backslashes.
        Path uploadDir = Paths.get("uploads").toAbsolutePath().normalize();
        String location = uploadDir.toUri().toString(); // e.g. file:///D:/chrome%20downloads/.../uploads/

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}
