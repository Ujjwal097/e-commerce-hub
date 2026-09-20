package com.lumina.ecommerce.service;

import com.lumina.ecommerce.dto.*;
import com.lumina.ecommerce.entity.OtpEntity;
import com.lumina.ecommerce.entity.UserEntity;
import com.lumina.ecommerce.repository.OtpRepository;
import com.lumina.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {

    public static final String SUPER_ADMIN_EMAIL = "pandditujjwaltiwari@gmail.com";
    public static final String SUPER_ADMIN_EMAIL_ALT = "panditujjwaltiwari@gmail.com";
    public static final String SUPER_ADMIN_PHONE = "9889933097";
    public static final int OTP_EXPIRY_SECONDS = 120; // 2 minutes strict validity

    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final SmsService smsService;
    private final Random random = new Random();

    public AuthService(
            UserRepository userRepository, 
            OtpRepository otpRepository,
            EmailService emailService,
            SmsService smsService
    ) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    public boolean isSuperAdmin(String identifier) {
        if (identifier == null) return false;
        String clean = identifier.trim().toLowerCase();
        return SUPER_ADMIN_EMAIL.equalsIgnoreCase(clean)
                || SUPER_ADMIN_EMAIL_ALT.equalsIgnoreCase(clean)
                || SUPER_ADMIN_PHONE.equals(clean)
                || "pandditujjwaltiwari".equalsIgnoreCase(clean)
                || "panditujjwaltiwari".equalsIgnoreCase(clean);
    }

    /**
     * 1. User Sign Up Initiation:
     * - Validates email & phone number uniqueness
     * - Blocks Super Admin credentials from signing up (Super Admin can only login)
     * - Sends 2-minute OTP to selected channel (logged in server console, omitted from API response)
     */
    public SendOtpResponse initiateSignup(SignupRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new SendOtpResponse(false, "Email address is required for Sign Up", null, null, 0);
        }
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            return new SendOtpResponse(false, "Phone number is required for Sign Up", null, null, 0);
        }

        String email = request.getEmail().trim().toLowerCase();
        String phone = request.getPhoneNumber().trim().replaceAll("[^0-9+]", "");
        String name = request.getName() != null ? request.getName().trim() : "Valued Customer";

        // Super Admin block: cannot sign up
        if (isSuperAdmin(email) || isSuperAdmin(phone)) {
            return new SendOtpResponse(
                    false,
                    "Super Admin account already exists and cannot sign up. Please use Sign In.",
                    null, null, 0);
        }

        // Duplicate checks
        if (userRepository.existsByEmail(email)) {
            return new SendOtpResponse(
                    false,
                    "Email address '" + email + "' is already registered. Please sign in instead.",
                    null, null, 0);
        }

        if (userRepository.existsByPhoneNumber(phone)) {
            return new SendOtpResponse(
                    false,
                    "Phone number '" + phone + "' is already registered. Please sign in instead.",
                    null, null, 0);
        }

        // Check custom username if provided
        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            String customUsername = request.getUsername().trim().toLowerCase().replaceAll("[^a-zA-Z0-9_]", "");
            if (userRepository.existsByUsername(customUsername)) {
                return new SendOtpResponse(
                        false,
                        "Username '@" + customUsername + "' is already taken. Please choose another username.",
                        null, null, 0);
            }
        }

        // Determine destination channel for OTP
        String otpChannel = request.getOtpChannel() != null ? request.getOtpChannel().trim().toLowerCase() : "email";
        String targetIdentifier = "phone".equals(otpChannel) ? phone : email;

        // Generate 6-digit OTP
        int codeInt = 100000 + random.nextInt(900000);
        String otpCode = String.valueOf(codeInt);
        long expiresAt = System.currentTimeMillis() + (OTP_EXPIRY_SECONDS * 1000L);

        try {
            otpRepository.deleteByIdentifier(targetIdentifier);
        } catch (Exception ignored) {}

        OtpEntity otpEntity = new OtpEntity(targetIdentifier, otpCode, "customer", expiresAt);
        otpRepository.save(otpEntity);

        // Print securely to server terminal
        System.out.println("========================================================================");
        System.out.println(">>> [LUMINA SIGNUP OTP] New User: " + name);
        System.out.println(">>> Destination (" + otpChannel.toUpperCase() + "): " + targetIdentifier);
        System.out.println(">>> SECURITY OTP CODE: " + otpCode + " (Strict 2-minute validity)");
        System.out.println("========================================================================");

        // Real notification dispatch
        if ("phone".equalsIgnoreCase(otpChannel)) {
            smsService.sendOtpSms(phone, otpCode, name);
        } else {
            emailService.sendOtpEmail(email, otpCode, name);
        }

        return new SendOtpResponse(
                true,
                "Verification code sent to " + targetIdentifier,
                targetIdentifier,
                null, // Explicitly NULL: OTP is never revealed to the client!
                OTP_EXPIRY_SECONDS);
    }

    /**
     * 2. User Sign Up Verification:
     * - Validates OTP within 2-minute window
     * - Creates and persists new User in DB with email, phone, and username
     * - Issues session token
     */
    public AuthResponse verifySignup(VerifySignupRequest request) {
        if (request.getCode() == null || request.getCode().trim().isEmpty()) {
            return new AuthResponse(false, "Verification code is required.", null, null);
        }

        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String phone = request.getPhoneNumber() != null ? request.getPhoneNumber().trim().replaceAll("[^0-9+]", "") : "";
        String code = request.getCode().trim();
        String otpChannel = request.getOtpChannel() != null ? request.getOtpChannel().trim().toLowerCase() : "email";
        String targetIdentifier = "phone".equals(otpChannel) ? phone : email;

        if (targetIdentifier.isEmpty()) {
            return new AuthResponse(false, "Email or phone number is required.", null, null);
        }

        Optional<OtpEntity> otpOpt = otpRepository.findTopByIdentifierAndCodeOrderByExpiresAtDesc(targetIdentifier, code);
        if (otpOpt.isEmpty()) {
            return new AuthResponse(false, "Invalid OTP code. Please enter the correct 6-digit verification code.", null, null);
        }

        OtpEntity otp = otpOpt.get();
        if (System.currentTimeMillis() > otp.getExpiresAt()) {
            return new AuthResponse(false, "OTP has expired (2 minutes validity). Please click Resend OTP.", null, null);
        }

        // Clean up OTP
        try {
            otpRepository.deleteByIdentifier(targetIdentifier);
        } catch (Exception ignored) {}

        // Double check duplicate in case of concurrent submissions
        if (userRepository.existsByEmail(email)) {
            return new AuthResponse(false, "Email address is already registered. Please sign in.", null, null);
        }
        if (userRepository.existsByPhoneNumber(phone)) {
            return new AuthResponse(false, "Phone number is already registered. Please sign in.", null, null);
        }

        // Generate username if not provided
        String username = request.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = email.contains("@")
                    ? email.substring(0, email.indexOf("@")).toLowerCase().replaceAll("[^a-zA-Z0-9_]", "")
                    : "user_" + (phone.length() >= 4 ? phone.substring(phone.length() - 4) : "guest");
        } else {
            username = username.trim().toLowerCase().replaceAll("[^a-zA-Z0-9_]", "");
        }

        // Ensure username uniqueness
        if (userRepository.existsByUsername(username)) {
            username = username + "_" + (100 + random.nextInt(900));
        }

        String userId = "usr_" + UUID.randomUUID().toString().substring(0, 8);
        String displayName = request.getName() != null && !request.getName().trim().isEmpty()
                ? request.getName().trim()
                : "Lumina Member";

        UserEntity newUser = new UserEntity(
                userId,
                email,
                phone,
                username,
                displayName,
                "customer",
                Instant.now().toString());

        UserEntity savedUser = userRepository.save(newUser);

        String token = "lumina_jwt_" + UUID.randomUUID().toString().replace("-", "");
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(savedUser);

        System.out.println(">> [SIGNUP SUCCESS] New user registered: " + savedUser.getEmail() + " (@" + savedUser.getUsername() + ")");
        return new AuthResponse(true, "Registration successful! Welcome to Lumina Luxe.", token, userDto);
    }

    /**
     * 3. User Login Initiation:
     * - Checks if user exists in DB (or is Super Admin)
     * - If user not found, returns error prompting sign up
     * - Generates 2-minute OTP, prints to server terminal, and returns response with otp=null
     */
    public SendOtpResponse sendOtp(SendOtpRequest request) {
        if (request.getIdentifier() == null || request.getIdentifier().trim().isEmpty()) {
            return new SendOtpResponse(false, "Email address or phone number is required", null, null, 0);
        }

        String rawId = request.getIdentifier().trim();
        String identifier = rawId.toLowerCase();
        boolean superAdmin = isSuperAdmin(rawId);

        String role = "customer";

        if (superAdmin) {
            role = "admin";
            // Ensure Super Admin exists in DB
            Optional<UserEntity> existingAdmin = userRepository.findByEmail(SUPER_ADMIN_EMAIL)
                    .or(() -> userRepository.findByEmail(SUPER_ADMIN_EMAIL_ALT))
                    .or(() -> userRepository.findByIdentifier(SUPER_ADMIN_EMAIL))
                    .or(() -> userRepository.findByPhoneNumber(SUPER_ADMIN_PHONE));

            if (existingAdmin.isEmpty()) {
                UserEntity admin = new UserEntity(
                        "usr_superadmin",
                        SUPER_ADMIN_EMAIL,
                        SUPER_ADMIN_PHONE,
                        "pandditujjwaltiwari",
                        "Ujjwal Tiwari (Super Admin)",
                        "admin",
                        Instant.now().toString());
                userRepository.save(admin);
            } else {
                UserEntity admin = existingAdmin.get();
                if (!"admin".equals(admin.getRole()) || !SUPER_ADMIN_EMAIL.equals(admin.getEmail())) {
                    admin.setEmail(SUPER_ADMIN_EMAIL);
                    admin.setUsername("pandditujjwaltiwari");
                    admin.setRole("admin");
                    userRepository.save(admin);
                }
            }
        } else {
            // Normal user: must already be registered in DB!
            Optional<UserEntity> userOpt = userRepository.findByEmailOrPhone(identifier);
            if (userOpt.isEmpty()) {
                return new SendOtpResponse(
                        false,
                        "No account found with this " + (identifier.contains("@") ? "email" : "phone number") + ". Please Sign Up to create your account.",
                        null, null, 0);
            }
            role = userOpt.get().getRole();
        }

        // Generate 6-digit OTP
        int codeInt = 100000 + random.nextInt(900000);
        String otpCode = String.valueOf(codeInt);
        long expiresAt = System.currentTimeMillis() + (OTP_EXPIRY_SECONDS * 1000L);

        try {
            otpRepository.deleteByIdentifier(identifier);
        } catch (Exception ignored) {}

        OtpEntity otpEntity = new OtpEntity(identifier, otpCode, role, expiresAt);
        otpRepository.save(otpEntity);

        // Print securely to server terminal
        System.out.println("========================================================================");
        System.out.println(">>> [LUMINA LOGIN OTP] Target: " + identifier + " (Role: " + role.toUpperCase() + ")");
        System.out.println(">>> SECURITY OTP CODE: " + otpCode + " (Strict 2-minute validity)");
        System.out.println("========================================================================");

        // Real notification dispatch
        if (identifier.contains("@")) {
            emailService.sendOtpEmail(identifier, otpCode, isSuperAdmin(identifier) ? "Super Admin" : "Lumina Member");
        } else {
            smsService.sendOtpSms(identifier, otpCode, isSuperAdmin(identifier) ? "Super Admin" : "Lumina Member");
        }

        return new SendOtpResponse(
                true,
                "Verification code sent to " + identifier,
                identifier,
                null, // Explicitly NULL: never displayed on screen
                OTP_EXPIRY_SECONDS);
    }

    /**
     * 4. User Login Verification:
     * - Validates OTP against 2-minute window
     * - Issues session token and returns UserDto
     */
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String identifier = request.getIdentifier() != null ? request.getIdentifier().trim().toLowerCase() : "";
        String code = request.getCode() != null ? request.getCode().trim() : "";

        if (identifier.isEmpty() || code.isEmpty()) {
            return new AuthResponse(false, "Identifier and OTP are required.", null, null);
        }

        Optional<OtpEntity> otpOpt = otpRepository.findTopByIdentifierAndCodeOrderByExpiresAtDesc(identifier, code);
        if (otpOpt.isEmpty()) {
            return new AuthResponse(false, "Invalid OTP code. Please enter the correct 6-digit verification code.", null, null);
        }

        OtpEntity otp = otpOpt.get();
        if (System.currentTimeMillis() > otp.getExpiresAt()) {
            return new AuthResponse(false, "OTP has expired (2 minutes validity). Please click Resend OTP.", null, null);
        }

        // Invalidate OTP
        try {
            otpRepository.deleteByIdentifier(identifier);
        } catch (Exception ignored) {}

        boolean superAdmin = isSuperAdmin(identifier);

        UserEntity user;
        if (superAdmin) {
            user = userRepository.findByEmail(SUPER_ADMIN_EMAIL)
                    .or(() -> userRepository.findByEmail(SUPER_ADMIN_EMAIL_ALT))
                    .or(() -> userRepository.findByIdentifier(SUPER_ADMIN_EMAIL))
                    .or(() -> userRepository.findByPhoneNumber(SUPER_ADMIN_PHONE))
                    .orElseGet(() -> {
                        UserEntity admin = new UserEntity(
                                "usr_superadmin",
                                SUPER_ADMIN_EMAIL,
                                SUPER_ADMIN_PHONE,
                                "pandditujjwaltiwari",
                                "Ujjwal Tiwari (Super Admin)",
                                "admin",
                                Instant.now().toString());
                        return userRepository.save(admin);
                    });
            if (!"admin".equals(user.getRole())) {
                user.setRole("admin");
                userRepository.save(user);
            }
        } else {
            Optional<UserEntity> userOpt = userRepository.findByEmailOrPhone(identifier);
            if (userOpt.isEmpty()) {
                return new AuthResponse(false, "User account not found. Please sign up first.", null, null);
            }
            user = userOpt.get();
        }

        String token = "lumina_jwt_" + UUID.randomUUID().toString().replace("-", "");
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(user);

        System.out.println(">> [LOGIN SUCCESS] User authenticated: " + user.getIdentifier() + " (Role: " + user.getRole() + ")");
        return new AuthResponse(true, "Authentication successful", token, userDto);
    }

    /**
     * 5. Update Username:
     * - Allows user to customize their username post-login
     * - Validates format and checks uniqueness
     */
    public AuthResponse updateUsername(UpdateUsernameRequest request) {
        if (request.getIdentifier() == null || request.getIdentifier().trim().isEmpty()) {
            return new AuthResponse(false, "User identifier is required", null, null);
        }
        if (request.getNewUsername() == null || request.getNewUsername().trim().isEmpty()) {
            return new AuthResponse(false, "New username is required", null, null);
        }

        String cleanIdentifier = request.getIdentifier().trim().toLowerCase();
        String newUsername = request.getNewUsername().trim().toLowerCase().replaceAll("[^a-zA-Z0-9_]", "");

        if (newUsername.length() < 3 || newUsername.length() > 30) {
            return new AuthResponse(false, "Username must be between 3 and 30 characters (letters, numbers, underscores).", null, null);
        }

        Optional<UserEntity> userOpt = userRepository.findByEmailOrPhone(cleanIdentifier);
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "User not found.", null, null);
        }

        UserEntity user = userOpt.get();

        // If same username, no-op
        if (newUsername.equalsIgnoreCase(user.getUsername())) {
            return new AuthResponse(true, "Username is already set to @" + newUsername, null, new AuthResponse.UserDto(user));
        }

        // Check if taken by someone else
        Optional<UserEntity> existingWithUsername = userRepository.findByUsername(newUsername);
        if (existingWithUsername.isPresent() && !existingWithUsername.get().getId().equals(user.getId())) {
            return new AuthResponse(false, "Username '@" + newUsername + "' is already taken. Please choose another.", null, null);
        }

        user.setUsername(newUsername);
        UserEntity saved = userRepository.save(user);

        System.out.println(">> [USERNAME UPDATED] " + user.getEmail() + " is now @" + newUsername);
        return new AuthResponse(true, "Username updated to @" + newUsername, null, new AuthResponse.UserDto(saved));
    }
}
