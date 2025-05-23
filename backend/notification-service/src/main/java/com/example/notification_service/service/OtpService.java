package com.example.notification_service.service;

import com.example.event.dto.ChangeEmailRequest;
import com.example.event.dto.ChangePhoneRequest;
import com.example.event.dto.ResetPasswordRequest;
import com.example.notification_service.configuration.TwilioConfig;
import com.example.notification_service.dto.request.*;
import com.example.notification_service.repository.SendEmailClient;
import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.kafka.support.SendResult;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OtpService {

    final TwilioConfig twilioConfig;
    final KafkaTemplate<String, Object> kafkaTemplate;
    final SendEmailClient sendEmailClient;
    private static final String RESET_PASSWORD_TOPIC = "reset-password-topic";
    final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    @Value("${app.mail.brevo.api-key}")
    String apiKey;
    @Value("${app.mail.brevo.name-sender}")
    String nameSender;
    @Value("${app.mail.brevo.email-sender}")
    String emailSender;

    private static final long OTP_EXPIRATION_TIME_MS = 10 * 60 * 1000; // 10 phút
    private static final long RESEND_COOLDOWN_MS = 1 * 60 * 1000; // 1 phút

    private static class OtpData {
        String otp;
        long expirationTime;
        long lastSentTime;

        OtpData(String otp, long expirationTime, long lastSentTime) {
            this.otp = otp;
            this.expirationTime = expirationTime;
            this.lastSentTime = lastSentTime;
        }
    }

    public String sendOtpMail(OtpRequest request) {
        String email = request.getEmail();
        long currentTime = System.currentTimeMillis();

        OtpData existingData = otpStorage.get(email);
        if (existingData != null && (currentTime - existingData.lastSentTime < RESEND_COOLDOWN_MS)) {
            return "Vui lòng chờ " + (RESEND_COOLDOWN_MS / 1000) + " giây trước khi gửi lại OTP.";
        }

        String otp = generateOtp();
        long expirationTime = currentTime + OTP_EXPIRATION_TIME_MS;
        otpStorage.put(email, new OtpData(otp, expirationTime, currentTime));

        MailRequest mailRequest = MailRequest.builder()
                .sender(Sender.builder().name(nameSender).email(emailSender).build())
                .to(Collections.singletonList(
                        Recipient.builder().name("User").email(email).build()))
                .subject("Mã OTP xác nhận email của bạn")
                .textContent("Mã OTP của bạn là: " + otp)
                .build();

        try {
            sendEmailClient.sendMail(apiKey, mailRequest);
            return "OTP đã được gửi thành công.";
        } catch (FeignException e) {
            e.printStackTrace();
            return "Lỗi khi gửi OTP.";
        }
    }

    public String verifyEmailOtp(OtpVerificationRequest request, String userId) {
        String email = request.getEmail();
        OtpData otpData = otpStorage.get(email);
        if (otpData == null) {
            return "OTP không hợp lệ hoặc đã hết hạn.";
        }

        long currentTime = System.currentTimeMillis();
        if (currentTime > otpData.expirationTime) {
            otpStorage.remove(email);
            return "OTP đã hết hạn.";
        }

        if (otpData.otp.equals(request.getOtp())) {
            ChangeEmailRequest changeEmailRequest = ChangeEmailRequest.builder()
                    .userId(userId)
                    .email(email)
                    .build();

            CompletableFuture<SendResult<String, Object>> future =
                    kafkaTemplate.send("change-email", changeEmailRequest);

            String resultMessage = future.handle((result, ex) -> {
                if (ex == null) {
                    otpStorage.remove(email);
                    return "Xác thực OTP thành công. Yêu cầu thay đổi email đã được gửi.";
                } else {
                    return ex.getMessage();
                }
            }).join();

            return resultMessage;
        } else {
            return "OTP không hợp lệ.";
        }
    }

    public String sendForgotPasswordMail(OtpRequest request) {
        String email = request.getEmail();
        long currentTime = System.currentTimeMillis();

        OtpData existingData = otpStorage.get(email);
        if (existingData != null && (currentTime - existingData.lastSentTime < RESEND_COOLDOWN_MS)) {
            return "Vui lòng chờ " + (RESEND_COOLDOWN_MS / 1000) + " giây trước khi gửi lại OTP.";
        }

        String otp = generateOtp();
        long expirationTime = currentTime + OTP_EXPIRATION_TIME_MS;
        otpStorage.put(email, new OtpData(otp, expirationTime, currentTime));

        MailRequest mailRequest = MailRequest.builder()
                .sender(Sender.builder().name(nameSender).email(emailSender).build())
                .to(Collections.singletonList(
                        Recipient.builder().name("User").email(email).build()))
                .subject("Quên mật khẩu - OTP đặt lại mật khẩu")
                .textContent("Mã OTP để đặt lại mật khẩu của bạn là: " + otp)
                .build();

        try {
            sendEmailClient.sendMail(apiKey, mailRequest);
            return "OTP đã được gửi thành công.";
        } catch (FeignException e) {
            e.printStackTrace();
            return "Lỗi khi gửi OTP.";
        }
    }

    public String verifyForgotPasswordOtp(OtpVerificationRequest request) {
        String email = request.getEmail();
        OtpData otpData = otpStorage.get(email);
        if (otpData == null) {
            return "OTP không hợp lệ hoặc đã hết hạn.";
        }

        long currentTime = System.currentTimeMillis();
        if (currentTime > otpData.expirationTime) {
            otpStorage.remove(email);
            return "OTP đã hết hạn.";
        }

        if (otpData.otp.equals(request.getOtp())) {
            return "Xác thực OTP thành công. Bạn có thể đặt lại mật khẩu.";
        } else {
            return "OTP không hợp lệ.";
        }
    }

    public String updatePassword(SendResetPasswordRequest request) {
        String email = request.getEmail();
        OtpData otpData = otpStorage.get(email);
        if (otpData == null) {
            return "OTP không hợp lệ hoặc đã hết hạn.";
        }

        long currentTime = System.currentTimeMillis();
        if (currentTime > otpData.expirationTime) {
            otpStorage.remove(email);
            return "OTP đã hết hạn.";
        }

        if (otpData.otp.equals(request.getOtp())) {
            ResetPasswordRequest event = new ResetPasswordRequest(email, request.getPassword());
            kafkaTemplate.send(RESET_PASSWORD_TOPIC, event);
            otpStorage.remove(email);
            return "Cập nhật mật khẩu thành công.";
        } else {
            return "OTP không hợp lệ.";
        }
    }

    public void sendPhoneOtp(OtpRequest request) {
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());

        Verification verification = Verification.creator(
                twilioConfig.getServiceSid(),
                request.getPhone(),
                "sms"
        ).create();

        System.out.println("OTP sent: " + verification.getSid());
    }

    public String verifyPhoneOtp(OtpVerificationRequest otpVerificationRequest, String userId) {
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());

        VerificationCheck verificationCheck = VerificationCheck.creator(
                        twilioConfig.getServiceSid())
                .setTo(otpVerificationRequest.getPhone())
                .setCode(otpVerificationRequest.getOtp())
                .create();

        System.out.println("Verification status: " + verificationCheck.getStatus());

        if (!"approved".equals(verificationCheck.getStatus())) {
            return "OTP không hợp lệ hoặc đã hết hạn.";
        }

        ChangePhoneRequest changePhoneRequest = ChangePhoneRequest.builder()
                .phone(otpVerificationRequest.getPhone())
                .userId(userId)
                .build();

        try {
            CompletableFuture<SendResult<String, Object>> future
                    = kafkaTemplate.send("change-phone", changePhoneRequest);
            return future.handle((result, ex) -> {
                if (ex == null) {
                    return "Xác thực OTP thành công. Yêu cầu thay đổi số điện thoại đã được gửi.";
                } else {
                    return ex.getMessage();
                }
            }).join();
        } catch (Exception e) {
            System.err.println("Lỗi khi gửi Kafka: " + e.getMessage());
            return "Xác thực OTP thành công nhưng không thể gửi Kafka.";
        }
    }

    private String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
}