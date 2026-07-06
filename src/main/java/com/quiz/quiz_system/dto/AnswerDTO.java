package com.quiz.quiz_system.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerDTO {
    private Long questionId;
    
    private String selectedKey;
    
    // Accept selectedOptionKey from frontend and map to selectedKey
    @JsonProperty("selectedOptionKey")
    public void setSelectedOptionKey(String selectedOptionKey) {
        this.selectedKey = selectedOptionKey;
    }
}
