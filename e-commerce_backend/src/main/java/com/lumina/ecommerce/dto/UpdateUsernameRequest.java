package com.lumina.ecommerce.dto;

public class UpdateUsernameRequest {
    private String identifier;
    private String newUsername;

    public UpdateUsernameRequest() {}

    public UpdateUsernameRequest(String identifier, String newUsername) {
        this.identifier = identifier;
        this.newUsername = newUsername;
    }

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getNewUsername() { return newUsername; }
    public void setNewUsername(String newUsername) { this.newUsername = newUsername; }
}
