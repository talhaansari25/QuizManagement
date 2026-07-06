package com.quiz.quiz_system.controller;

import com.quiz.quiz_system.dto.ApiResponse;
import com.quiz.quiz_system.dto.QuizResultDTO;
import com.quiz.quiz_system.entity.User;
import com.quiz.quiz_system.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/result")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ResultController {

    private final ResultService resultService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<QuizResultDTO>>> getResultsByUserId(
            @PathVariable Long userId,
            Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();

        // Allow access only if the authenticated user owns the results OR is an ADMIN
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !currentUser.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied: you can only view your own results"));
        }

        List<QuizResultDTO> results = resultService.getResultsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<QuizResultDTO>>> getAllResults() {
        List<QuizResultDTO> results = resultService.getAllResults();
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/quiz/{quizId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<QuizResultDTO>>> getResultsByQuizId(@PathVariable Long quizId) {
        List<QuizResultDTO> results = resultService.getResultsByQuizId(quizId);
        return ResponseEntity.ok(ApiResponse.success(results));
    }
}
