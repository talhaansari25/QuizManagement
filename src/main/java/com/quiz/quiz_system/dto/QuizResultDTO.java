package com.quiz.quiz_system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultDTO {
    private Long id;
    private Long quizId;
    private String quizTitle;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private Integer unanswered;
    private Double totalMarks;
    private Double obtainedMarks;
    private Double percentage;
    private Boolean isPassed;
    private Integer timeTakenSeconds;
    private LocalDateTime submittedAt;
}

