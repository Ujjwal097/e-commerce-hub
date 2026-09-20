package com.lumina.ecommerce.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    /**
     * Dispatches real HTML OTP email to recipient inbox using JavaMailSender (Gmail SMTP).
     */
    public boolean sendOtpEmail(String toEmail, String otpCode, String recipientName) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            return false;
        }

        String displayName = (recipientName != null && !recipientName.trim().isEmpty())
                ? recipientName.trim()
                : "Valued Customer";

        boolean hasConfiguredCredentials = mailSender != null
                && mailFrom != null && !mailFrom.trim().isEmpty() && !mailFrom.contains("YOUR_")
                && mailPassword != null && !mailPassword.trim().isEmpty() && !mailPassword.contains("YOUR_");

        if (hasConfiguredCredentials) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(mailFrom, "Lumina Luxe Security");
                helper.setTo(toEmail.trim());
                helper.setSubject("Lumina Luxe Verification Code: " + otpCode);

                String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="utf-8">
                      <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 20px; color: #f8fafc; }
                        .card { max-width: 520px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 36px 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
                        .logo { font-size: 24px; font-weight: 800; letter-spacing: 0.1em; color: #818cf8; text-transform: uppercase; margin-bottom: 24px; text-align: center; }
                        h2 { font-size: 20px; color: #f8fafc; margin-bottom: 12px; font-weight: 700; }
                        p { font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0 0 16px; }
                        .otp-box { background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15)); border: 2px dashed #6366f1; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
                        .otp-code { font-size: 36px; font-family: monospace; font-weight: 800; letter-spacing: 10px; color: #a5b4fc; }
                        .expiry-badge { display: inline-block; background: rgba(239, 68, 68, 0.15); color: #f87171; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; margin-top: 8px; }
                        .footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; text-align: center; }
                      </style>
                    </head>
                    <body>
                      <div class="card">
                        <div class="logo">✦ LUMINA LUXE ✦</div>
                        <h2>Security Verification</h2>
                        <p>Hello <strong>""" + displayName + """
                        </strong>,</p>
                        <p>We received a verification request for your Lumina Luxe account. Please use the 6-digit security code below to complete your access:</p>
                        
                        <div class="otp-box">
                          <div class="otp-code">""" + otpCode + """
                        </div>
                          <div class="expiry-badge">⏱ Valid strictly for 2 minutes</div>
                        </div>

                        <p>For your protection, never share this verification code with anyone. Lumina Luxe representatives will never ask for your code.</p>
                        
                        <div class="footer">
                          &copy; 2026 Lumina Luxe Inc. • 256-Bit Encrypted Security
                        </div>
                      </div>
                    </body>
                    </html>
                    """;

                helper.setText(html, true);
                mailSender.send(message);

                System.out.println("========================================================================");
                System.out.println(">>> [REAL EMAIL DISPATCHED] Successfully sent live OTP to: " + toEmail);
                System.out.println("========================================================================");
                return true;
            } catch (Exception e) {
                System.err.println(">>> [EMAIL SEND FAILED] Could not send live email: " + e.getMessage());
            }
        } else {
            System.out.println(">>> [EMAIL SIMULATION] Live SMTP not configured in application.properties.");
            System.out.println(">>> (Add Gmail App Password to 'spring.mail.password' to enable instant live inbox delivery)");
        }

        return false;
    }

    /**
     * Dispatches order placement confirmation HTML email to recipient inbox.
     */
    public boolean sendOrderSuccessEmail(String toEmail, String orderId, double amount, String recipientName) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            return false;
        }

        String displayName = (recipientName != null && !recipientName.trim().isEmpty())
                ? recipientName.trim()
                : "Valued Customer";

        boolean hasConfiguredCredentials = mailSender != null
                && mailFrom != null && !mailFrom.trim().isEmpty() && !mailFrom.contains("YOUR_")
                && mailPassword != null && !mailPassword.trim().isEmpty() && !mailPassword.contains("YOUR_");

        if (hasConfiguredCredentials) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(mailFrom, "Lumina Luxe Orders");
                helper.setTo(toEmail.trim());
                helper.setSubject("Order Confirmed! #" + orderId + " - Lumina Luxe");

                String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="utf-8">
                      <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 20px; color: #f8fafc; }
                        .card { max-width: 520px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 36px 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
                        .logo { font-size: 24px; font-weight: 800; letter-spacing: 0.1em; color: #818cf8; text-transform: uppercase; margin-bottom: 24px; text-align: center; }
                        h2 { font-size: 22px; color: #10b981; margin-bottom: 12px; font-weight: 700; text-align: center; }
                        p { font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0 0 16px; }
                        .order-box { background: rgba(99,102,241,0.1); border: 1px solid #6366f1; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center; }
                        .order-id { font-size: 18px; font-weight: 800; color: #a5b4fc; }
                        .order-amount { font-size: 32px; font-weight: 800; color: #34d399; margin-top: 8px; }
                        .footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; text-align: center; }
                      </style>
                    </head>
                    <body>
                      <div class="card">
                        <div class="logo">✦ LUMINA LUXE ✦</div>
                        <h2>Order Confirmed!</h2>
                        <p>Hello <strong>""" + displayName + """
                        </strong>,</p>
                        <p>Thank you for choosing Lumina Luxe. Your order has been authorized and confirmed for dispatch.</p>
                        
                        <div class="order-box">
                          <div class="order-id">Order Reference: """ + orderId + """
                        </div>
                          <div class="order-amount">Total Paid: ₹""" + String.format("%.2f", amount) + """
                        </div>
                        </div>

                        <p>Our concierge team is preparing your package. You can view full tracking and order updates anytime in your account.</p>
                        
                        <div class="footer">
                          &copy; 2026 Lumina Luxe Inc. • 256-Bit Encrypted Payments
                        </div>
                      </div>
                    </body>
                    </html>
                    """;

                helper.setText(html, true);
                mailSender.send(message);

                System.out.println("========================================================================");
                System.out.println(">>> [REAL ORDER EMAIL DISPATCHED] Confirmation sent to: " + toEmail + " | Order: " + orderId);
                System.out.println("========================================================================");
                return true;
            } catch (Exception e) {
                System.err.println(">>> [ORDER EMAIL SEND FAILED] " + e.getMessage());
            }
        }
        return false;
    }
}
