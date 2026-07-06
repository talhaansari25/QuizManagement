package com.quiz.quiz_system.controller;

import com.quiz.quiz_system.dto.*;
import com.quiz.quiz_system.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class QuizController {

    private final QuizService quizService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuizDTO>>> getAllQuizzes() {
        List<QuizDTO> quizzes = quizService.getAllActiveQuizzes();
        return ResponseEntity.ok(ApiResponse.success(quizzes));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<QuizDTO>>> getAllQuizzesAdmin() {
        List<QuizDTO> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(ApiResponse.success(quizzes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuizDetailDTO>> getQuizById(@PathVariable Long id) {
        try {
            QuizDetailDTO quiz = quizService.getQuizById(id);
            return ResponseEntity.ok(ApiResponse.success(quiz));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuizDTO>> createQuiz(@Valid @RequestBody QuizCreateRequest request) {
        QuizDTO quiz = quizService.createQuiz(request);
        return ResponseEntity.ok(ApiResponse.success("Quiz created successfully", quiz));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuizDTO>> updateQuiz(
            @PathVariable Long id,
            @Valid @RequestBody QuizCreateRequest request) {
        try {
            QuizDTO quiz = quizService.updateQuiz(id, request);
            return ResponseEntity.ok(ApiResponse.success("Quiz updated successfully", quiz));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteQuiz(@PathVariable Long id) {
        try {
            quizService.deleteQuiz(id);
            return ResponseEntity.ok(ApiResponse.success("Quiz deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuizDTO>> toggleQuizStatus(@PathVariable Long id) {
        try {
            QuizDTO quiz = quizService.toggleQuizStatus(id);
            return ResponseEntity.ok(ApiResponse.success("Quiz status updated", quiz));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<QuizResultDTO>> submitQuiz(@Valid @RequestBody QuizSubmitRequest request) {
        try {
            QuizResultDTO result = quizService.submitQuiz(request);
            return ResponseEntity.ok(ApiResponse.success("Quiz submitted successfully", result));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
