package com.lumina.ecommerce.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "otps")
public class OtpEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String identifier;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String role; // customer or admin

    @Column(nullable = false)
    private Long expiresAt;

    public OtpEntity() {}

    public OtpEntity(String identifier, String code, String role, Long expiresAt) {
        this.identifier = identifier;
        this.code = code;
        this.role = role;
        this.expiresAt = expiresAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Long expiresAt) { this.expiresAt = expiresAt; }
}
