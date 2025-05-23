package com.example.notification_service.service;

import com.example.notification_service.dto.request.MailRequest;
import com.example.notification_service.dto.request.SendMailRequest;
import com.example.notification_service.dto.request.Sender;
import com.example.notification_service.dto.response.SendMailResponse;
import com.example.notification_service.repository.SendEmailClient;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendMailService {
     final SendEmailClient sendEmailClient;
     @Value("${app.mail.brevo.api-key}")
     String apiKey;
    @Value("${app.mail.brevo.name-sender}")
     String nameSender;
    @Value("${app.mail.brevo.email-sender}")
     String emailSender;

    public SendMailResponse sendMail(SendMailRequest request){
        MailRequest mailRequest = MailRequest.builder()
                .sender(
                        Sender.builder()
                        .name(nameSender)
                        .email(emailSender)
                        .build()
                )
                .to(List.of(request.getTo()))
                .subject(request.getSubject())
                .textContent(request.getTextContent())
                .build();
        SendMailResponse SendMailResponse = null;
        try {
            SendMailResponse = sendEmailClient.sendMail(apiKey, mailRequest);
        }catch (FeignException.FeignClientException e) {
            e.printStackTrace();
        }
        return SendMailResponse;
    }

}
