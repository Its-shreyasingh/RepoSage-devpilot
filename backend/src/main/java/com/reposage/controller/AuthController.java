package com.reposage.controller;

import com.reposage.dto.UserProfileDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${app.auth.enabled:false}")
    private boolean authEnabled;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUser() {
        if (!authEnabled) {
            // Demo mode: Return guest developer profile for seamless local testing
            return ResponseEntity.ok(UserProfileDto.builder()
                    .authenticated(true)
                    .demoMode(true)
                    .username("guest-developer")
                    .name("Demo Engineer")
                    .avatarUrl("https://avatars.githubusercontent.com/u/583231?v=4")
                    .email("guest@reposage.local")
                    .build());
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof OAuth2User oauth2User) {
            Map<String, Object> attributes = oauth2User.getAttributes();
            String login = (String) attributes.get("login");
            String name = (String) attributes.get("name");
            String avatarUrl = (String) attributes.get("avatar_url");
            String email = (String) attributes.get("email");

            return ResponseEntity.ok(UserProfileDto.builder()
                    .authenticated(true)
                    .demoMode(false)
                    .username(login != null ? login : "github-user")
                    .name(name != null ? name : login)
                    .avatarUrl(avatarUrl != null ? avatarUrl : "https://avatars.githubusercontent.com/u/583231?v=4")
                    .email(email)
                    .build());
        }

        return ResponseEntity.ok(UserProfileDto.builder()
                .authenticated(false)
                .demoMode(false)
                .build());
    }
}

