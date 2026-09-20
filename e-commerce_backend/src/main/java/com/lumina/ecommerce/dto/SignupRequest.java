package com.lumina.ecommerce.dto;

public class SignupRequest {
    private String name;
    private String email;
    private String phoneNumber;
    private String username;
    private String otpChannel; // "email" or "phone"

    public SignupRequest() {}

    public SignupRequest(String name, String email, String phoneNumber, String username, String otpChannel) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.username = username;
        this.otpChannel = otpChannel;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getOtpChannel() { return otpChannel; }
    public void setOtpChannel(String otpChannel) { this.otpChannel = otpChannel; }
}
