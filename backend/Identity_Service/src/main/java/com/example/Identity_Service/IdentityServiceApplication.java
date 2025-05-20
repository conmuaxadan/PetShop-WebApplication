package com.example.Identity_Service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.ApplicationContext;

import java.util.Arrays;

@SpringBootApplication
@EnableFeignClients
public class IdentityServiceApplication {
	public static void main(String[] args) {

		SpringApplication.run(IdentityServiceApplication.class, args);

	}

}
