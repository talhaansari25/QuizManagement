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
public class QuizDTO {
    private Long id;
    private String title;
    private String description;
    private Integer timeLimitMinutes;
    private Double totalMarks;
    private Double passingMarks;
    private Boolean negativeMarking;
    private Double negativeMarkValue;
    private Boolean isActive;
    private Integer questionCount;
    private LocalDateTime createdAt;
}
