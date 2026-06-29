package com.example.taskora_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // The authenticated SMTP account. Gmail requires the From header to match
    // the authenticated user, otherwise mail is rejected or rewritten.
    @Value("${spring.mail.username}")
    private String fromAddress;

    @Async // Runs in the background so it doesn't freeze the user's screen while loading
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom(fromAddress);

            mailSender.send(message);
            System.out.println("[EmailService] Email successfully sent to " + to + " | subject: " + subject);
        } catch (Exception e) {
            System.err.println("[EmailService] FAILED to send email to " + to + " | reason: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
