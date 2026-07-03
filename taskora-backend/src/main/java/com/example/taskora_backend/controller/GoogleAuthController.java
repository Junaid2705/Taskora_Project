package com.example.taskora_backend.controller;

import com.example.taskora_backend.dto.JwtResponse;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.UserRepository;
import com.example.taskora_backend.security.JwtUtils;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/api/auth/google")
@RequiredArgsConstructor
public class GoogleAuthController {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder encoder;

    @Value("${google.client.id}")
    private String googleClientId;

    /**
     * Step 1: Frontend sends Google credential (ID token).
     * If user exists → return JWT.
     * If new user → return needsRole=true with Google info.
     */
    @PostMapping
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload) {
        String credential = payload.get("credential");
        if (credential == null || credential.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Google credential is required.");
        }

        GoogleIdToken.Payload googlePayload = verifyGoogleToken(credential);
        if (googlePayload == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token.");
        }

        String email = googlePayload.getEmail();
        String name = (String) googlePayload.get("name");
        String googleId = googlePayload.getSubject();

        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            // Existing user — generate JWT and return
            User user = existingUser.get();
            String jwt = jwtUtils.generateTokenFromUsername(user.getUsername());
            return ResponseEntity.ok(new JwtResponse(
                jwt, user.getUserId(), user.getUsername(), user.getEmail(),
                "ROLE_" + user.getRole().name()
            ));
        }

        // New user — needs role selection
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("needsRole", true);
        response.put("googleEmail", email);
        response.put("googleName", name != null ? name : "");
        response.put("googleId", googleId);
        return ResponseEntity.ok(response);
    }

    /**
     * Step 2: After role selection, create the user and return JWT.
     */
    @PostMapping("/complete")
    public ResponseEntity<?> completeGoogleSignup(@RequestBody Map<String, String> payload) {
        String email = payload.get("googleEmail");
        String name = payload.get("googleName");
        String googleId = payload.get("googleId");
        String role = payload.get("role");

        if (email == null || role == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and role are required.");
        }

        // Validate role
        User.Role userRole;
        try {
            userRole = User.Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role. Use FREELANCER, EMPLOYER, or CREATOR.");
        }

        if (userRole == User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot register as admin via Google.");
        }

        // Check if already exists (race condition guard)
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists.");
        }

        // Generate username from email prefix
        String username = email.split("@")[0].replaceAll("[^a-zA-Z0-9_]", "").toLowerCase();
        // Make unique if needed
        if (userRepository.findByUsername(username).isPresent()) {
            username = username + "_" + new Random().nextInt(9999);
        }

        // Create user
        User user = new User();
        user.setFullName(name != null ? name : username);
        user.setUsername(username);
        user.setEmail(email);
        user.setMobile("");
        user.setPassword(encoder.encode(UUID.randomUUID().toString())); // Random password (user logs in via Google)
        user.setRole(userRole);
        user.setEmailVerified(true); // Google already verified their email
        user.setStatus(User.Status.ACTIVE);
        userRepository.save(user);

        // Generate JWT
        String jwt = jwtUtils.generateTokenFromUsername(user.getUsername());
        return ResponseEntity.ok(new JwtResponse(
            jwt, user.getUserId(), user.getUsername(), user.getEmail(),
            "ROLE_" + user.getRole().name()
        ));
    }

    private GoogleIdToken.Payload verifyGoogleToken(String credential) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();
            GoogleIdToken idToken = verifier.verify(credential);
            if (idToken != null) {
                return idToken.getPayload();
            }
        } catch (Exception e) {
            System.err.println("[GoogleAuth] Token verification failed: " + e.getMessage());
        }
        return null;
    }
}
