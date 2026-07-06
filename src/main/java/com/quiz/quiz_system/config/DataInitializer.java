package com.quiz.quiz_system.config;

import com.quiz.quiz_system.entity.*;
import com.quiz.quiz_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@quiz.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("System Administrator")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user created: admin / admin123");
        }

        // Create sample user if not exists
        if (!userRepository.existsByUsername("student")) {
            User student = User.builder()
                    .username("student")
                    .email("student@quiz.com")
                    .password(passwordEncoder.encode("student123"))
                    .fullName("Sample Student")
                    .role(Role.USER)
                    .build();
            userRepository.save(student);
            System.out.println("Sample user created: student / student123");
        }

        // Quiz and questions are loaded from data.sql
    }
}

