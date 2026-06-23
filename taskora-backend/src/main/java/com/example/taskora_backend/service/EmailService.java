package com.example.taskora_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.example.taskora_backend.service.EmailService;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async // Runs in the background so it doesn't freeze the user's screen while loading
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("noreply@taskora.com");
        
        mailSender.send(message);
    }
}