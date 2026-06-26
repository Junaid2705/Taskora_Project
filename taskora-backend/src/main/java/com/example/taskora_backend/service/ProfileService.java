package com.example.taskora_backend.service;

import com.example.taskora_backend.dto.ChangePasswordRequest;
import com.example.taskora_backend.dto.ProfileUpdateRequest;
import com.example.taskora_backend.model.User;
import com.example.taskora_backend.model.UserProfile;
import com.example.taskora_backend.repository.UserProfileRepository;
import com.example.taskora_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
    }

    /** Returns the user's profile row, creating an empty one on first access. */
    @Transactional
    public UserProfile getOrCreateProfile(Long userId) {
        return profileRepository.findByUser_UserId(userId).orElseGet(() -> {
            UserProfile profile = new UserProfile();
            profile.setUser(getUser(userId));
            return profileRepository.save(profile);
        });
    }

    /** Combined account + profile view for the logged-in user. */
    @Transactional
    public Map<String, Object> getMyProfile(Long userId) {
        User user = getUser(userId);
        UserProfile profile = getOrCreateProfile(userId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("userId", user.getUserId());
        result.put("fullName", user.getFullName());
        result.put("username", user.getUsername());
        result.put("email", user.getEmail());
        result.put("mobile", user.getMobile());
        result.put("role", user.getRole() != null ? user.getRole().name() : null);
        result.put("status", user.getStatus() != null ? user.getStatus().name() : null);
        result.put("emailVerified", user.getEmailVerified());

        result.put("headline", profile.getHeadline());
        result.put("bio", profile.getBio());
        result.put("skills", profile.getSkills());
        result.put("experience", profile.getExperience());
        result.put("education", profile.getEducation());
        result.put("country", profile.getCountry());
        result.put("state", profile.getState());
        result.put("city", profile.getCity());
        result.put("avatar", profile.getAvatar());
        result.put("coverImage", profile.getCoverImage());
        result.put("website", profile.getWebsite());
        result.put("linkedin", profile.getLinkedin());
        result.put("github", profile.getGithub());
        return result;
    }

    @Transactional
    public Map<String, Object> updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = getUser(userId);
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
            userRepository.save(user);
        }

        UserProfile profile = getOrCreateProfile(userId);
        profile.setHeadline(request.getHeadline());
        profile.setBio(request.getBio());
        profile.setSkills(request.getSkills());
        profile.setExperience(request.getExperience());
        profile.setEducation(request.getEducation());
        profile.setCountry(request.getCountry());
        profile.setState(request.getState());
        profile.setCity(request.getCity());
        profile.setWebsite(request.getWebsite());
        profile.setLinkedin(request.getLinkedin());
        profile.setGithub(request.getGithub());
        profileRepository.save(profile);

        return getMyProfile(userId);
    }

    @Transactional
    public String uploadAvatar(Long userId, MultipartFile file) {
        String url = fileStorageService.store(file, "avatar");
        // Save to both UserProfile and User so that avatar shows everywhere
        // (contacts, chat, job applications all read User.avatarUrl)
        UserProfile profile = getOrCreateProfile(userId);
        profile.setAvatar(url);
        profileRepository.save(profile);

        User user = getUser(userId);
        user.setAvatarUrl(url);
        userRepository.save(user);
        return url;
    }

    @Transactional
    public String uploadCover(Long userId, MultipartFile file) {
        String url = fileStorageService.store(file, "cover");
        UserProfile profile = getOrCreateProfile(userId);
        profile.setCoverImage(url);
        profileRepository.save(profile);

        User user = getUser(userId);
        user.setCoverUrl(url);
        userRepository.save(user);
        return url;
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = getUser(userId);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect.");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(Long userId) {
        User user = getUser(userId);
        profileRepository.findByUser_UserId(userId).ifPresent(profileRepository::delete);
        userRepository.delete(user);
    }
}
