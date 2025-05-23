package com.example.notification_service.configuration;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Getter
@Configuration
public class TwilioConfig {

    @Value("${app.phone.twilio.account-sid}")
    private String accountSid;

    @Value("${app.phone.twilio.auth-token}")
    private String authToken;

    @Value("${app.phone.twilio.phone-number}")
    private String phoneNumber;

    @Value("${app.phone.twilio.service-sid}") // Thêm Service SID
    private String serviceSid;
}
