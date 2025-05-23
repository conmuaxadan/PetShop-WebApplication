package com.example.notification_service.controller;

import com.example.event.dto.NotificationRequest;
import com.example.notification_service.dto.request.Recipient;
import com.example.notification_service.dto.request.SendMailRequest;
import com.example.notification_service.service.SendMailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class SendMailController {
    SendMailService sendMailService;
    // Send email
//    @PostMapping("/send-email")
//    public ApiResponse<SendMailResponse> sendMail(@RequestBody SendMailRequest request){
//        return ApiResponse.<SendMailResponse>builder()
//               .data(sendMailService.sendMail(request))
//               .build();
//    }
    @KafkaListener(topics = "user-created")
    public void consume(@Payload NotificationRequest notificationRequest) {
        System.out.println("Received: " + notificationRequest);
        sendMailService.sendMail(
            SendMailRequest.builder()
                    .textContent(notificationRequest.getTextContent())
                    .subject(notificationRequest.getSubject())
                    .to(Recipient.builder()
                            .email(notificationRequest.getEmailReceptor())
                            .name(notificationRequest.getNameReceptor())
                            .build())
                    .build()
        );

    }


}
