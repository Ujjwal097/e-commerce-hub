package com.lumina.ecommerce.dto;

public class SendOtpResponse {
    private boolean success;
    private String message;
    private String identifier;
    private String otp;
    private int expiresInSeconds;

    public SendOtpResponse() {
    }

    public SendOtpResponse(boolean success, String message, String identifier, String otp, int expiresInSeconds) {
        this.success = success;
        this.message = message;
        this.identifier = identifier;
        this.otp = otp;
        this.expiresInSeconds = expiresInSeconds;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public int getExpiresInSeconds() {
        return expiresInSeconds;
    }

    public void setExpiresInSeconds(int expiresInSeconds) {
        this.expiresInSeconds = expiresInSeconds;
    }
}
