package com.example.taskora_backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

/**
 * Centralizes saving uploaded files to the local "uploads" folder and
 * returning a publicly reachable URL. The URL is derived from the current
 * request, so it always matches the host/port the backend is running on
 * (no hardcoded localhost:8080).
 */
@Service
public class FileStorageService {

    private static final String UPLOAD_DIR = "uploads";

    /**
     * Saves the given file with a unique, prefixed name and returns its absolute URL.
     *
     * @param file   the uploaded multipart file
     * @param prefix logical type used in the filename, e.g. "avatar", "cover", "portfolio"
     */
    public String store(MultipartFile file, String prefix) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No file was provided.");
        }
        try {
            String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
            String fileName = prefix + "_" + System.currentTimeMillis() + "_" + original;

            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Files.copy(file.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(fileName)
                    .toUriString();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not store the uploaded file.");
        }
    }
}
