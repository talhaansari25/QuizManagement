package com.quiz.quiz_system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
    private Long id;
    private String questionText;
    private Double marks;
    private List<OptionDTO> options;
    // Note: correctKey is intentionally excluded to prevent cheating
}
