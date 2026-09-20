package com.lumina.ecommerce.dto;

public class SendOtpRequest {
    private String identifier;
    private String type;
    private String role;
    private String name;
    private String mode; // "signin" or "signup"

    public SendOtpRequest() {}

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
}
