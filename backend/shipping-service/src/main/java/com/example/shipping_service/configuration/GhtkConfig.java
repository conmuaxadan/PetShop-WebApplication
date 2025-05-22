package com.example.shipping_service.configuration;


import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.client.RestTemplate;

@Getter
@Configuration
public class GhtkConfig {

    @Value("${GHTK_STAGING_URL}")
    private String ghtkStagingUrl;
    @Value("${GHTK_PRODUCTION_URL}")
    private String ghtkProductionUrl;

    @Value("${GHTK_STAGING_TOKEN}")
    private String ghtkStagingToken;
    @Value("${GHTK_PRODUCTION_TOKEN}")
    private String ghtkProductionToken;

    @Value("${GHTK_PARTNER_CODE}")
    private String ghtkPartnerCode;

    @Bean()
    @Primary
    public RestTemplate ghtkRestTemplate() {
        return new RestTemplate();
    }

}

