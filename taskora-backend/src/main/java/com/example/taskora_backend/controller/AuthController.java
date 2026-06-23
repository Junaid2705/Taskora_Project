package com.example.taskora_backend.controller;

import com.example.taskora_backend.dto.JwtResponse;
import com.example.taskora_backend.dto.LoginRequest;
import com.example.taskora_backend.dto.RegisterRequest;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.repository.UserRepository;
import com.example.taskora_backend.security.JwtUtils;
import com.example.taskora_backend.security.UserDetailsImpl;
import com.example.taskora_backend.service.AuthService;
import com.example.taskora_backend.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    
    // Injected dependencies for Email Verification and Password Reset
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        // 1. Process standard registration through your existing service
        Map<String, String> response = authService.registerUser(registerRequest);
        
        if (response.containsKey("error")) {
            return ResponseEntity.badRequest().body(response);
        }
        
        // 2. Draft and send the verification email
        String verifyToken = jwtUtils.generateTokenFromUsername(registerRequest.getUsername());
        String verifyLink = "http://localhost:5173/verify-email?token=" + verifyToken;
        
        String emailBody = "Welcome to Taskora, " + registerRequest.getFullName() + "!\n\n" +
                           "Please verify your email address by clicking the link below:\n" +
                           verifyLink + "\n\n" +
                           "This link will expire soon.";
                           
        emailService.sendEmail(registerRequest.getEmail(), "Verify your Taskora Account", emailBody);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return ResponseEntity.ok(new JwtResponse(
                jwt, 
                userDetails.getId(), 
                userDetails.getUsername(), 
                userDetails.getEmail(), 
                role));
    }

    // --- Email Verification Endpoint ---
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
        if (jwtUtils.validateJwtToken(token)) {
            String username = jwtUtils.getUserNameFromJwtToken(token);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));

            user.setEmailVerified(true);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Email successfully verified!"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired token."));
    }

    // --- Forgot Password Endpoint ---
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam("email") String email) {
        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "No account found with that email."));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String resetToken = jwtUtils.generateTokenFromUsername(user.getUsername());
            
            String resetLink = "http://localhost:5173/reset-password?token=" + resetToken;
            String emailBody = "Hello " + user.getFullName() + ",\n\n" +
                               "You requested a password reset. Click the link below to create a new password:\n" +
                               resetLink + "\n\n" +
                               "If you did not request this, please ignore this email.";

            emailService.sendEmail(user.getEmail(), "Taskora Password Reset", emailBody);
        }

        return ResponseEntity.ok(Map.of("message", "Password reset link sent to your email."));
    }

    // --- Reset Password Endpoint ---
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String token, @RequestParam("newPassword") String newPassword) {
        if (jwtUtils.validateJwtToken(token)) {
            String username = jwtUtils.getUserNameFromJwtToken(token);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));

            user.setPassword(encoder.encode(newPassword));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Password successfully reset! You can now login."));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired token."));
    }
}