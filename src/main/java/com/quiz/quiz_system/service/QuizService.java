package com.quiz.quiz_system.service;

import com.quiz.quiz_system.dto.*;
import com.quiz.quiz_system.entity.*;
import com.quiz.quiz_system.repository.QuestionRepository;
import com.quiz.quiz_system.repository.QuizRepository;
import com.quiz.quiz_system.repository.QuizResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizResultRepository quizResultRepository;
    private final AuthService authService;

    public List<QuizDTO> getAllActiveQuizzes() {
        return quizRepository.findByIsActiveTrue().stream()
                .map(this::convertToQuizDTO)
                .collect(Collectors.toList());
    }

    public List<QuizDTO> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(this::convertToQuizDTO)
                .collect(Collectors.toList());
    }

    public QuizDetailDTO getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));

        return convertToQuizDetailDTO(quiz);
    }

    @Transactional
    public QuizDTO createQuiz(QuizCreateRequest request) {
        User currentUser = authService.getCurrentUser();

        Quiz quiz = Quiz.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .timeLimitMinutes(request.getTimeLimitMinutes())
                .totalMarks(request.getTotalMarks())
                .passingMarks(request.getPassingMarks())
                .negativeMarking(request.getNegativeMarking())
                .negativeMarkValue(request.getNegativeMarkValue())
                .isActive(true)
                .createdBy(currentUser.getId())
                .build();

        if (request.getQuestions() != null) {
            for (QuestionCreateRequest questionReq : request.getQuestions()) {
                Question question = Question.builder()
                        .questionText(questionReq.getQuestionText())
                        .marks(questionReq.getMarks())
                        .correctKey(questionReq.getCorrectKey())
                        .quiz(quiz)
                        .build();

                if (questionReq.getOptions() != null) {
                    List<Option> options = new ArrayList<>();
                    for (OptionCreateRequest optionReq : questionReq.getOptions()) {
                        Option option = Option.builder()
                                .optionKey(optionReq.getOptionKey())
                                .optionText(optionReq.getOptionText())
                                .question(question)
                                .build();
                        options.add(option);
                    }
                    question.setOptions(options);
                }

                quiz.getQuestions().add(question);
            }
        }

        Quiz savedQuiz = quizRepository.save(quiz);
        return convertToQuizDTO(savedQuiz);
    }

    @Transactional
    public QuizDTO updateQuiz(Long id, QuizCreateRequest request) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));

        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        quiz.setTotalMarks(request.getTotalMarks());
        quiz.setPassingMarks(request.getPassingMarks());
        quiz.setNegativeMarking(request.getNegativeMarking());
        quiz.setNegativeMarkValue(request.getNegativeMarkValue());

        Quiz savedQuiz = quizRepository.save(quiz);
        return convertToQuizDTO(savedQuiz);
    }

    @Transactional
    public void deleteQuiz(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
        quizRepository.delete(quiz);
    }

    @Transactional
    public QuizDTO toggleQuizStatus(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
        quiz.setIsActive(!quiz.getIsActive());
        Quiz savedQuiz = quizRepository.save(quiz);
        return convertToQuizDTO(savedQuiz);
    }

    @Transactional
    public QuizResultDTO submitQuiz(QuizSubmitRequest request) {
        User currentUser = authService.getCurrentUser();
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        List<Question> questions = quiz.getQuestions();
        Map<Long, String> answersMap = new HashMap<>();

        if (request.getAnswers() != null) {
            for (AnswerDTO answer : request.getAnswers()) {
                answersMap.put(answer.getQuestionId(), answer.getSelectedKey());
            }
        }

        int correctAnswers = 0;
        int wrongAnswers = 0;
        int unanswered = 0;
        double obtainedMarks = 0.0;

        for (Question question : questions) {
            String selectedKey = answersMap.get(question.getId());

            if (selectedKey == null || selectedKey.isEmpty()) {
                unanswered++;
            } else if (selectedKey.equals(question.getCorrectKey())) {
                correctAnswers++;
                obtainedMarks += question.getMarks();
            } else {
                wrongAnswers++;
                // Apply negative marking if enabled
                if (Boolean.TRUE.equals(quiz.getNegativeMarking()) && quiz.getNegativeMarkValue() != null) {
                    obtainedMarks -= quiz.getNegativeMarkValue();
                }
            }
        }

        // Ensure obtained marks don't go below 0
        obtainedMarks = Math.max(0, obtainedMarks);

        double percentage = (obtainedMarks / quiz.getTotalMarks()) * 100;
        boolean isPassed = quiz.getPassingMarks() != null && obtainedMarks >= quiz.getPassingMarks();

        QuizResult result = QuizResult.builder()
                .user(currentUser)
                .quiz(quiz)
                .totalQuestions(questions.size())
                .correctAnswers(correctAnswers)
                .wrongAnswers(wrongAnswers)
                .unanswered(unanswered)
                .totalMarks(quiz.getTotalMarks())
                .obtainedMarks(obtainedMarks)
                .percentage(percentage)
                .isPassed(isPassed)
                .timeTakenSeconds(request.getTimeTakenSeconds())
                .build();

        QuizResult savedResult = quizResultRepository.save(result);
        return convertToQuizResultDTO(savedResult);
    }

    private QuizDTO convertToQuizDTO(Quiz quiz) {
        return QuizDTO.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .timeLimitMinutes(quiz.getTimeLimitMinutes())
                .totalMarks(quiz.getTotalMarks())
                .passingMarks(quiz.getPassingMarks())
                .negativeMarking(quiz.getNegativeMarking())
                .negativeMarkValue(quiz.getNegativeMarkValue())
                .isActive(quiz.getIsActive())
                .questionCount(quiz.getQuestions().size())
                .createdAt(quiz.getCreatedAt())
                .build();
    }

    private QuizDetailDTO convertToQuizDetailDTO(Quiz quiz) {
        List<Question> questions = new ArrayList<>(quiz.getQuestions());

        // Randomize questions order
        Collections.shuffle(questions);

        List<QuestionDTO> questionDTOs = questions.stream()
                .map(this::convertToQuestionDTO)
                .collect(Collectors.toList());

        return QuizDetailDTO.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .timeLimitMinutes(quiz.getTimeLimitMinutes())
                .totalMarks(quiz.getTotalMarks())
                .passingMarks(quiz.getPassingMarks())
                .negativeMarking(quiz.getNegativeMarking())
                .negativeMarkValue(quiz.getNegativeMarkValue())
                .questions(questionDTOs)
                .build();
    }

    private QuestionDTO convertToQuestionDTO(Question question) {
        List<Option> options = new ArrayList<>(question.getOptions());

        // Randomize options order
        Collections.shuffle(options);

        List<OptionDTO> optionDTOs = options.stream()
                .map(this::convertToOptionDTO)
                .collect(Collectors.toList());

        return QuestionDTO.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .marks(question.getMarks())
                .options(optionDTOs)
                .build();
    }

    private OptionDTO convertToOptionDTO(Option option) {
        return OptionDTO.builder()
                .id(option.getId())
                .optionKey(option.getOptionKey())
                .optionText(option.getOptionText())
                .build();
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

