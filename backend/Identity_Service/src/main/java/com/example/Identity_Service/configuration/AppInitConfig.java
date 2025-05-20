package com.example.Identity_Service.configuration;

import com.example.Identity_Service.constant.PredefinedRole;
import com.example.Identity_Service.entity.Role;
import com.example.Identity_Service.entity.User;
import com.example.Identity_Service.repository.RoleRepository;
import com.example.Identity_Service.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Configuration
public class AppInitConfig {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner appRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            // Ensure "admin" role exists
            Role adminRole;
            Optional<Role> adminRoleOptional = roleRepository.findById("admin");
            if (adminRoleOptional.isEmpty()) {
                adminRole = Role.builder()
                        .name(PredefinedRole.ADMIN_ROLE)
                        .description("Administrator role")
                        .isActive(true) // Ensure all required fields are set
                        .createAt(Timestamp.valueOf(LocalDateTime.now()))
                        .build();
                roleRepository.save(adminRole);
                log.info("Admin role created.");
            } else {
                adminRole = adminRoleOptional.get();
                log.info("Admin role already exists.");
            }

            // Create admin user if not exists
            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                User user = User.builder()
                        .username("admin1")
                        .email("admin@example.com")
                        .password(passwordEncoder.encode("admin123")) // Secure default password
                        .roles(new HashSet<>(Set.of(adminRole)))
                        .build();
                userRepository.save(user);
                log.info("Admin user created.");
            } else {
                log.info("Admin user already exists.");
            }
        };
    }
}