package com.example.notification_service.repository;

import com.example.notification_service.dto.request.MailRequest;
import com.example.notification_service.dto.response.SendMailResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "notification-service", url ="${app.mail.brevo.url}")
public interface SendEmailClient {
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    SendMailResponse sendMail(@RequestHeader("api-key") String apiKey
                             ,@RequestBody MailRequest request );
}
