package com.lumina.ecommerce.controller;

import com.lumina.ecommerce.dto.*;
import com.lumina.ecommerce.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Initiate Sign Up: validates duplicate email/phone, generates 2-min OTP, logs to server console.
     */
    @PostMapping("/signup/initiate")
    public ResponseEntity<SendOtpResponse> initiateSignup(@RequestBody SignupRequest request) {
        SendOtpResponse response = authService.initiateSignup(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Verify Sign Up: validates 2-min OTP, saves new user in DB, returns JWT token + user profile.
     */
    @PostMapping("/signup/verify")
    public ResponseEntity<AuthResponse> verifySignup(@RequestBody VerifySignupRequest request) {
        AuthResponse response = authService.verifySignup(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Initiate Sign In / Send OTP: checks existing user (or super admin), generates 2-min OTP.
     */
    @PostMapping("/send-otp")
    public ResponseEntity<SendOtpResponse> sendOtp(@RequestBody SendOtpRequest request) {
        SendOtpResponse response = authService.sendOtp(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Verify Sign In: validates 2-min OTP, logs in user, returns token + user profile.
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
        AuthResponse response = authService.verifyOtp(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Update Username: allows authenticated user to modify their username.
     */
    @PutMapping("/username")
    public ResponseEntity<AuthResponse> updateUsername(@RequestBody UpdateUsernameRequest request) {
        AuthResponse response = authService.updateUsername(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
