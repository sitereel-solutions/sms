package com.society.management.security;

import com.society.management.entity.Role;
import com.society.management.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

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
        Optional<User> userOpt = getCurrentUser();
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // If Super Admin, allow inspecting specific society via X-Society-ID header
            if (user.getRole() == Role.ROLE_SUPER_ADMIN) {
                ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attrs != null) {
                    HttpServletRequest req = attrs.getRequest();
                    String headerSoc = req.getHeader("X-Society-ID");
                    if (headerSoc != null && !headerSoc.isBlank() && !"all".equalsIgnoreCase(headerSoc)) {
                        return headerSoc;
                    }
                }
            }
            return user.getSocietyId() != null ? user.getSocietyId() : "soc-grv";
        }
        
        // Fallback for public requests with header
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs != null) {
            HttpServletRequest req = attrs.getRequest();
            String headerSoc = req.getHeader("X-Society-ID");
            if (headerSoc != null && !headerSoc.isBlank()) {
                return headerSoc;
            }
        }

        return "soc-grv";
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
