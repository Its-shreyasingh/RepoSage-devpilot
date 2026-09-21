package dev.backend.dto;

import java.util.UUID;

public record UserResponse(
    UUID id,
    Long githubID,
    String GithubUsername,
    String displayName,
    String avatarUrl
)
    {
}
