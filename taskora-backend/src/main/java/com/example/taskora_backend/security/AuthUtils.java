package com.example.taskora_backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Small reusable helpers for reading the currently authenticated user
 * out of the Spring Security context. Keeps controllers/services from
 * duplicating the same boilerplate across every module.
 */
public final class AuthUtils {

    private AuthUtils() {
    }

    /** Returns the UserDetailsImpl of the currently authenticated user, or null if none. */
    public static UserDetailsImpl currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl userDetails)) {
            return null;
        }
        return userDetails;
    }

    /** Returns the id of the currently authenticated user. */
    public static Long currentUserId() {
        UserDetailsImpl user = currentUser();
        return user != null ? user.getId() : null;
    }

    /** Returns the role authority (e.g. "ROLE_ADMIN") of the current user, or null. */
    public static String currentRole() {
        UserDetailsImpl user = currentUser();
        if (user == null || user.getAuthorities().isEmpty()) {
            return null;
        }
        return user.getAuthorities().iterator().next().getAuthority();
    }

    /** True when the current user holds the given role. Accepts "ADMIN" or "ROLE_ADMIN". */
    public static boolean hasRole(String role) {
        String normalized = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        return normalized.equals(currentRole());
    }

    public static boolean isAdmin() {
        return hasRole("ADMIN");
    }
}
