package com.society.management.security;

import com.society.management.entity.Role;
import com.society.management.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static Optional<User> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return Optional.of(user);
        }
        return Optional.empty();
    }

    public static String getCurrentSocietyId() {
        return getCurrentUser()
                .map(u -> u.getSocietyId() != null ? u.getSocietyId() : "soc-grv")
                .orElse("soc-grv");
    }

    public static boolean isSuperAdmin() {
        return getCurrentUser()
                .map(u -> u.getRole() == Role.ROLE_SUPER_ADMIN)
                .orElse(false);
    }

    public static boolean isAdmin() {
        return getCurrentUser()
                .map(u -> u.getRole() == Role.ROLE_ADMIN)
                .orElse(false);
    }

    public static boolean isResident() {
        return getCurrentUser()
                .map(u -> u.getRole() == Role.ROLE_RESIDENT)
                .orElse(false);
    }

    public static Optional<String> getCurrentUserFlatNumber() {
        return getCurrentUser().map(User::getFlatNumber);
    }
}
