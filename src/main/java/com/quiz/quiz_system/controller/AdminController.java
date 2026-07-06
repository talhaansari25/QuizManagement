package com.quiz.quiz_system.controller;

import com.quiz.quiz_system.dto.*;
import com.quiz.quiz_system.entity.*;
import com.quiz.quiz_system.repository.*;
import com.quiz.quiz_system.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final QuizResultRepository quizResultRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final QuizService quizService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalQuizzes = quizRepository.count();
        long totalUsers = userRepository.countByRole(Role.USER);
        long totalAttempts = quizResultRepository.count();
        
        Double avgScore = quizResultRepository.findAveragePercentage();
        double averageScore = avgScore != null ? avgScore : 0.0;
        
        stats.put("totalQuizzes", totalQuizzes);
        stats.put("totalUsers", totalUsers);
        stats.put("totalAttempts", totalAttempts);
        stats.put("averageScore", averageScore);
        
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Stats retrieved successfully")
                .data(stats)
                .build());
    }

    @GetMapping("/results")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllResults() {
        List<QuizResult> results = quizResultRepository.findAllByOrderBySubmittedAtDesc();
        
        List<Map<String, Object>> resultDtos = results.stream().map(r -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", r.getId());
            dto.put("username", r.getUser().getUsername());
            dto.put("quizTitle", r.getQuiz().getTitle());
            dto.put("score", r.getObtainedMarks());
            dto.put("totalMarks", r.getTotalMarks());
            dto.put("correctAnswers", r.getCorrectAnswers());
            dto.put("wrongAnswers", r.getWrongAnswers());
            dto.put("unanswered", r.getUnanswered());
            dto.put("percentage", r.getPercentage());
            dto.put("passed", r.getIsPassed() != null && r.getIsPassed());
            dto.put("attemptedAt", r.getSubmittedAt());
            return dto;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.<List<Map<String, Object>>>builder()
                .success(true)
                .message("Results retrieved successfully")
                .data(resultDtos)
                .build());
    }

    @GetMapping("/quizzes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllQuizzesAdmin() {
        List<Quiz> quizzes = quizRepository.findAll();
        
        List<Map<String, Object>> quizDtos = quizzes.stream().map(q -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", q.getId());
            dto.put("title", q.getTitle());
            dto.put("description", q.getDescription());
            dto.put("timeLimitMinutes", q.getTimeLimitMinutes());
            dto.put("totalMarks", q.getTotalMarks());
            dto.put("passingMarks", q.getPassingMarks());
            dto.put("negativeMarking", q.getNegativeMarking() != null && q.getNegativeMarking());
            dto.put("negativeMarkValue", q.getNegativeMarkValue());
            dto.put("isActive", q.getIsActive() != null && q.getIsActive());
            dto.put("questionCount", q.getQuestions() != null ? q.getQuestions().size() : 0);
            dto.put("attemptCount", quizResultRepository.countByQuizId(q.getId()));
            dto.put("createdAt", q.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.<List<Map<String, Object>>>builder()
                .success(true)
                .message("Quizzes retrieved successfully")
                .data(quizDtos)
                .build());
    }

    @PostMapping("/quiz")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuizDTO>> createQuiz(@RequestBody QuizCreateRequest request) {
        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        quiz.setTotalMarks(request.getTotalMarks());
        quiz.setPassingMarks(request.getPassingMarks());
        quiz.setNegativeMarking(request.getNegativeMarking() != null ? request.getNegativeMarking() : false);
        quiz.setNegativeMarkValue(request.getNegativeMarkValue() != null ? request.getNegativeMarkValue() : 0.0);
        quiz.setIsActive(true);
        quiz.setQuestions(new ArrayList<>());
        
        Quiz savedQuiz = quizRepository.save(quiz);
        
        // Create questions
        int questionCount = 0;
        if (request.getQuestions() != null) {
            for (QuestionCreateRequest qReq : request.getQuestions()) {
                Question question = new Question();
                question.setQuestionText(qReq.getQuestionText());
                question.setMarks(qReq.getMarks());
                question.setCorrectKey(qReq.getCorrectKey());
                question.setQuiz(savedQuiz);
                question.setOptions(new ArrayList<>());
                
                Question savedQuestion = questionRepository.save(question);
                
                // Create options
                if (qReq.getOptions() != null) {
                    for (OptionCreateRequest oReq : qReq.getOptions()) {
                        Option option = new Option();
                        option.setOptionKey(oReq.getOptionKey());
                        option.setOptionText(oReq.getOptionText());
                        option.setQuestion(savedQuestion);
                        optionRepository.save(option);
                    }
                }
                questionCount++;
            }
        }
        
        QuizDTO quizDTO = QuizDTO.builder()
                .id(savedQuiz.getId())
                .title(savedQuiz.getTitle())
                .description(savedQuiz.getDescription())
                .timeLimitMinutes(savedQuiz.getTimeLimitMinutes())
                .totalMarks(savedQuiz.getTotalMarks())
                .passingMarks(savedQuiz.getPassingMarks())
                .negativeMarking(savedQuiz.getNegativeMarking())
                .negativeMarkValue(savedQuiz.getNegativeMarkValue())
                .isActive(savedQuiz.getIsActive())
                .questionCount(questionCount)
                .build();
        
        return ResponseEntity.ok(ApiResponse.<QuizDTO>builder()
                .success(true)
                .message("Quiz created successfully")
                .data(quizDTO)
                .build());
    }

    @PutMapping("/quiz/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> toggleQuizStatus(@PathVariable Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        boolean currentStatus = quiz.getIsActive() != null && quiz.getIsActive();
        quiz.setIsActive(!currentStatus);
        quizRepository.save(quiz);
        
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Quiz status updated")
                .data(quiz.getIsActive() ? "activated" : "deactivated")
                .build());
    }

    @DeleteMapping("/quiz/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteQuiz(@PathVariable Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        // Delete related results first
        quizResultRepository.deleteByQuizId(id);
        
        // Delete quiz (cascade will delete questions and options)
        quizRepository.delete(quiz);
        
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Quiz deleted successfully")
                .data("deleted")
                .build());
    }
}



