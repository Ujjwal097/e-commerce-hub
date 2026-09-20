package com.lumina.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class SmsService {

    @Value("${sms.provider:fast2sms}")
    private String smsProvider;

    @Value("${sms.fast2sms.api-key:}")
    private String fast2smsApiKey;

    @Value("${sms.twilio.account-sid:}")
    private String twilioSid;

    @Value("${sms.twilio.auth-token:}")
    private String twilioToken;

    @Value("${sms.twilio.from-phone:}")
    private String twilioFromPhone;

    /**
     * Dispatches real SMS OTP to the recipient's mobile phone via Fast2SMS or Twilio.
     */
    public boolean sendOtpSms(String phoneNumber, String otpCode, String recipientName) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return false;
        }

        String rawPhone = phoneNumber.replaceAll("[^0-9]", "");
        String tenDigitPhone = rawPhone;
        if (rawPhone.startsWith("91") && rawPhone.length() == 12) {
            tenDigitPhone = rawPhone.substring(2);
        }

        // 1. Fast2SMS Provider (India)
        if ("fast2sms".equalsIgnoreCase(smsProvider)) {
            boolean hasFast2SmsKey = fast2smsApiKey != null 
                    && !fast2smsApiKey.trim().isEmpty() 
                    && !fast2smsApiKey.contains("YOUR_");

            if (hasFast2SmsKey) {
                return sendViaFast2Sms(tenDigitPhone, otpCode);
            } else {
                System.out.println(">>> [SMS SIMULATION] Fast2SMS API key not yet configured in application.properties.");
                System.out.println(">>> (Add API key to 'sms.fast2sms.api-key' to send live SMS to mobile: " + tenDigitPhone + ")");
            }
        }

        // 2. Twilio Provider (International)
        if ("twilio".equalsIgnoreCase(smsProvider)) {
            boolean hasTwilio = twilioSid != null && !twilioSid.trim().isEmpty() && !twilioSid.contains("YOUR_")
                    && twilioToken != null && !twilioToken.trim().isEmpty() && !twilioToken.contains("YOUR_");

            if (hasTwilio) {
                String e164Phone = phoneNumber.startsWith("+") ? phoneNumber : ("+91" + tenDigitPhone);
                return sendViaTwilio(e164Phone, otpCode);
            } else {
                System.out.println(">>> [SMS SIMULATION] Twilio credentials not configured in application.properties.");
            }
        }

        return false;
    }

    private boolean sendViaFast2Sms(String tenDigitPhone, String otpCode) {
        // Attempt 1: Fast2SMS standard OTP route
        boolean sent = executeFast2SmsPost(
                String.format("{\"variables_values\":\"%s\",\"route\":\"otp\",\"numbers\":\"%s\"}", otpCode, tenDigitPhone),
                tenDigitPhone,
                otpCode,
                "OTP Route"
        );

        // Attempt 2: If OTP route didn't return 200, try Quick Route
        if (!sent) {
            String quickMessage = "Your Lumina Luxe verification code is " + otpCode + ". Valid for 2 minutes.";
            sent = executeFast2SmsPost(
                    String.format("{\"route\":\"q\",\"message\":\"%s\",\"flash\":0,\"numbers\":\"%s\"}", quickMessage, tenDigitPhone),
                    tenDigitPhone,
                    otpCode,
                    "Quick Route"
            );
        }

        return sent;
    }

    private boolean executeFast2SmsPost(String jsonPayload, String tenDigitPhone, String otpCode, String routeName) {
        try {
            URI uri = URI.create("https://www.fast2sms.com/dev/bulkV2");
            URL url = uri.toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("authorization", fast2smsApiKey.trim());
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(8000);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonPayload.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int status = conn.getResponseCode();
            BufferedReader br = new BufferedReader(new InputStreamReader(
                    status >= 200 && status < 300 ? conn.getInputStream() : conn.getErrorStream()
            ));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                response.append(line);
            }

            System.out.println("========================================================================");
            System.out.println(">>> [FAST2SMS " + routeName.toUpperCase() + "] HTTP " + status + " Response:");
            System.out.println(">>> " + response);
            System.out.println(">>> [TARGET MOBILE] " + tenDigitPhone + " | CODE: " + otpCode);
            System.out.println("========================================================================");
            return status == 200 && response.toString().contains("\"return\":true");
        } catch (Exception e) {
            System.err.println(">>> [FAST2SMS " + routeName + " ERROR] " + e.getMessage());
            return false;
        }
    }

    private boolean sendViaTwilio(String e164Phone, String otpCode) {
        try {
            String urlStr = String.format("https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json", twilioSid);
            URI uri = URI.create(urlStr);
            URL url = uri.toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");

            String auth = twilioSid + ":" + twilioToken;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
            conn.setRequestProperty("Authorization", "Basic " + encodedAuth);
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setDoOutput(true);
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(8000);

            String message = "Your Lumina Luxe verification code is " + otpCode + ". Valid strictly for 2 minutes.";
            String body = "To=" + URLEncoder.encode(e164Phone, StandardCharsets.UTF_8)
                    + "&From=" + URLEncoder.encode(twilioFromPhone, StandardCharsets.UTF_8)
                    + "&Body=" + URLEncoder.encode(message, StandardCharsets.UTF_8);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = body.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int status = conn.getResponseCode();
            System.out.println(">>> [TWILIO API RESPONSE] HTTP " + status + " for " + e164Phone);
            return status >= 200 && status < 300;
        } catch (Exception e) {
            System.err.println(">>> [TWILIO ERROR] Failed delivering live SMS: " + e.getMessage());
            return false;
        }
    }

    /**
     * Dispatches order placement confirmation SMS to recipient's mobile.
     */
    public boolean sendOrderSuccessSms(String phoneNumber, String orderId, double amount) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return false;
        }

        String rawPhone = phoneNumber.replaceAll("[^0-9]", "");
        String tenDigitPhone = rawPhone;
        if (rawPhone.startsWith("91") && rawPhone.length() == 12) {
            tenDigitPhone = rawPhone.substring(2);
        }

        String message = "Your Lumina Luxe order " + orderId + " of INR " + String.format("%.2f", amount) + " is placed successfully! Track order in your account.";
        System.out.println("========================================================================");
        System.out.println(">>> [ORDER SUCCESS SMS] Target: " + tenDigitPhone + " | Order: " + orderId);
        System.out.println(">>> Content: " + message);
        System.out.println("========================================================================");

        if ("fast2sms".equalsIgnoreCase(smsProvider) && fast2smsApiKey != null && !fast2smsApiKey.trim().isEmpty()) {
            return executeFast2SmsPost(
                    String.format("{\"route\":\"q\",\"message\":\"%s\",\"flash\":0,\"numbers\":\"%s\"}", message, tenDigitPhone),
                    tenDigitPhone,
                    orderId,
                    "Order Confirmation"
            );
        }
        return false;
    }
}

