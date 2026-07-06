package com.quiz.quiz_system.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptionCreateRequest {

    @NotBlank(message = "Option key is required")
    private String optionKey;

    @NotBlank(message = "Option text is required")
    private String optionText;
}
