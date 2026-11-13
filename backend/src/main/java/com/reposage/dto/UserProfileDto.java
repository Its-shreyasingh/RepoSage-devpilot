package com.reposage.dto;

public class UserProfileDto {
    private boolean authenticated;
    private boolean demoMode;
    private String username;
    private String name;
    private String avatarUrl;
    private String email;

    public UserProfileDto() {}

    public UserProfileDto(boolean authenticated, boolean demoMode, String username, String name, String avatarUrl, String email) {
        this.authenticated = authenticated;
        this.demoMode = demoMode;
        this.username = username;
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.email = email;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private boolean authenticated;
        private boolean demoMode;
        private String username;
        private String name;
        private String avatarUrl;
        private String email;

        public Builder authenticated(boolean authenticated) { this.authenticated = authenticated; return this; }
        public Builder demoMode(boolean demoMode) { this.demoMode = demoMode; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public Builder email(String email) { this.email = email; return this; }

        public UserProfileDto build() {
            return new UserProfileDto(authenticated, demoMode, username, name, avatarUrl, email);
        }
    }

    public boolean isAuthenticated() { return authenticated; }
    public void setAuthenticated(boolean authenticated) { this.authenticated = authenticated; }

    public boolean isDemoMode() { return demoMode; }
    public void setDemoMode(boolean demoMode) { this.demoMode = demoMode; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
