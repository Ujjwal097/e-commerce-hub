package com.lumina.ecommerce.dto;

public class VerifyOtpRequest {
    private String identifier;
    private String code;
    private String role;
    private String name;

    public VerifyOtpRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }

    public String getOtp() {
        return code;
    }
    public void setOtp(String otp) {
        this.code = otp;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
