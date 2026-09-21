package dev.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import dev.backend.dto.UserResponse;
import dev.backend.entity.User;
import dev.backend.security.AppUserPrincipal;
import dev.backend.security.CurrentUser;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping ("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final CurrentUser currentUser;

    @GetMapping("/login-url")
    public Map<String,String> loginUrl() {
        return Map.of("url","/oauth2/authorization/github");
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(){
        AppUserPrincipal principal=currentUser.require();
        User user=principal.getUser();
        return ResponseEntity.ok(new UserResponse(
            user.getId(),
            user.getGithubID(),
            user.getGithubUsername(),
            user.getDisplayName(),
            user.getAvatarUrl()));
        }
    }
    
