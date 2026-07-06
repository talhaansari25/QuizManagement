package com.quiz.quiz_system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Time limit is required")
    private Integer timeLimitMinutes;

    @NotNull(message = "Total marks is required")
    private Double totalMarks;

    private Double passingMarks;

    private Boolean negativeMarking;

    private Double negativeMarkValue;

    private List<QuestionCreateRequest> questions;
}

