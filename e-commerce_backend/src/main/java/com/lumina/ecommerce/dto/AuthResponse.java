package com.lumina.ecommerce.dto;

import com.lumina.ecommerce.entity.UserEntity;

public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private UserDto user;

    public AuthResponse() {}

    public AuthResponse(boolean success, String message, String token, UserDto user) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
    }

    public AuthResponse(boolean success, String token, UserDto user) {
        this.success = success;
        this.token = token;
        this.user = user;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public static class UserDto {
        private String id;
        private String identifier;
        private String email;
        private String phoneNumber;
        private String username;
        private String name;
        private String role;
        private String type;

        public UserDto() {}

        public UserDto(String id, String identifier, String name, String role, String type) {
            this.id = id;
            this.identifier = identifier;
            this.name = name;
            this.role = role;
            this.type = type;
            if (identifier != null && identifier.contains("@")) {
                this.email = identifier;
                this.username = identifier.substring(0, identifier.indexOf("@"));
            } else {
                this.phoneNumber = identifier;
                this.username = "user_" + (identifier != null ? identifier.substring(Math.max(0, identifier.length() - 4)) : "guest");
            }
        }

        public UserDto(String id, String identifier, String email, String phoneNumber, String username, String name, String role, String type) {
            this.id = id;
            this.identifier = identifier;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.username = username;
            this.name = name;
            this.role = role;
            this.type = type;
        }

        public UserDto(UserEntity entity) {
            this.id = entity.getId();
            this.identifier = entity.getIdentifier();
            this.email = entity.getEmail() != null ? entity.getEmail() : (entity.getIdentifier() != null && entity.getIdentifier().contains("@") ? entity.getIdentifier() : null);
            this.phoneNumber = entity.getPhoneNumber() != null ? entity.getPhoneNumber() : (entity.getIdentifier() != null && !entity.getIdentifier().contains("@") ? entity.getIdentifier() : null);
            this.username = entity.getUsername() != null ? entity.getUsername() : (this.email != null ? this.email.substring(0, this.email.indexOf("@")) : "user");
            this.name = entity.getName();
            this.role = entity.getRole();
            this.type = entity.getType();
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getIdentifier() { return identifier; }
        public void setIdentifier(String identifier) { this.identifier = identifier; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
    }
}
