package com.quiz.quiz_system.service;

import com.quiz.quiz_system.dto.QuizResultDTO;
import com.quiz.quiz_system.entity.QuizResult;
import com.quiz.quiz_system.repository.QuizResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final QuizResultRepository quizResultRepository;

    public List<QuizResultDTO> getResultsByUserId(Long userId) {
        return quizResultRepository.findByUserIdOrderBySubmittedAtDesc(userId).stream()
                .map(this::convertToQuizResultDTO)
                .collect(Collectors.toList());
    }

    public List<QuizResultDTO> getAllResults() {
        return quizResultRepository.findAll().stream()
                .map(this::convertToQuizResultDTO)
                .collect(Collectors.toList());
    }

    public List<QuizResultDTO> getResultsByQuizId(Long quizId) {
        return quizResultRepository.findByQuizId(quizId).stream()
                .map(this::convertToQuizResultDTO)
                .collect(Collectors.toList());
    }

    private QuizResultDTO convertToQuizResultDTO(QuizResult result) {
        return QuizResultDTO.builder()
                .id(result.getId())
                .quizId(result.getQuiz().getId())
                .quizTitle(result.getQuiz().getTitle())
                .totalQuestions(result.getTotalQuestions())
                .correctAnswers(result.getCorrectAnswers())
                .wrongAnswers(result.getWrongAnswers())
                .unanswered(result.getUnanswered())
                .totalMarks(result.getTotalMarks())
                .obtainedMarks(result.getObtainedMarks())
                .percentage(result.getPercentage())
                .isPassed(result.getIsPassed())
                .timeTakenSeconds(result.getTimeTakenSeconds())
                .submittedAt(result.getSubmittedAt())
                .build();
    }
}

