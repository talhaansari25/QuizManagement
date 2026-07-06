package com.quiz.quiz_system.dto;

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
public class QuizSubmitRequest {

    @NotNull(message = "Quiz ID is required")
    private Long quizId;

    private Integer timeTakenSeconds;

    private List<AnswerDTO> answers;
}
