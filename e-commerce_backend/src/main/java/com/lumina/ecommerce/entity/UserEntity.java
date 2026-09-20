package com.lumina.ecommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String identifier;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String phoneNumber;

    @Column(unique = true)
    private String username;

    private String name;

    @Column(nullable = false)
    private String type; // email or phone

    @Column(nullable = false)
    private String role; // customer or admin

    @Column(nullable = false)
    private String createdAt;

    public UserEntity() {}

    public UserEntity(String id, String identifier, String type, String role, String name, String createdAt) {
        this.id = id;
        this.identifier = identifier;
        this.type = type;
        this.role = role;
        this.name = name;
        this.createdAt = createdAt;
        if (identifier != null && identifier.contains("@")) {
            this.email = identifier.toLowerCase();
            this.username = identifier.substring(0, identifier.indexOf("@")).toLowerCase().replaceAll("[^a-zA-Z0-9_]", "");
        } else {
            this.phoneNumber = identifier;
            this.username = "user_" + (identifier != null ? identifier.substring(Math.max(0, identifier.length() - 4)) : "guest");
        }
    }

    public UserEntity(String id, String email, String phoneNumber, String username, String name, String role, String createdAt) {
        this.id = id;
        this.email = email != null ? email.trim().toLowerCase() : null;
        this.phoneNumber = phoneNumber != null ? phoneNumber.trim() : null;
        this.username = username != null ? username.trim().toLowerCase() : null;
        this.name = name != null ? name.trim() : null;
        this.role = role != null ? role.trim().toLowerCase() : "customer";
        this.identifier = this.email != null ? this.email : this.phoneNumber;
        this.type = this.email != null ? "email" : "phone";
        this.createdAt = createdAt;
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

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
