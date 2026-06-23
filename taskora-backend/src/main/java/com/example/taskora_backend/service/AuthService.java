package com.example.taskora_backend.service;

import com.example.taskora_backend.dto.RegisterRequest;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Map<String, String> registerUser(RegisterRequest request) {
        Map<String, String> response = new HashMap<>();

        // 1. Check if Username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            response.put("error", "Error: Username is already taken!");
            return response;
        }

        // 2. Check if Email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            response.put("error", "Error: Email is already in use!");
            return response;
        }

        // 3. Create new User account
        User user = new User();
        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Set Role (Convert string from frontend to Enum)
        try {
            user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            user.setRole(User.Role.FREELANCER); // Default fallback
        }

        userRepository.save(user);

        response.put("message", "User registered successfully!");
        return response;
    }
}