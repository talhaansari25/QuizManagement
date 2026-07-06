package com.quiz.quiz_system.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "Quiz System API");
        response.put("status", "Running");
        response.put("version", "1.0.0");
        response.put("endpoints", Map.of(
                "register", "POST /api/auth/register",
                "login", "POST /api/auth/login",
                "quizzes", "GET /api/quiz (requires auth)",
                "quiz_detail", "GET /api/quiz/{id} (requires auth)",
                "submit_quiz", "POST /api/quiz/submit (requires auth)",
                "results", "GET /api/result/{userId} (requires auth)"
        ));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        return ResponseEntity.ok(response);
    }
}
