package com.quiz.quiz_system.repository;

import com.quiz.quiz_system.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByUserId(Long userId);
    List<QuizResult> findByQuizId(Long quizId);
    List<QuizResult> findByUserIdOrderBySubmittedAtDesc(Long userId);
    List<QuizResult> findAllByOrderBySubmittedAtDesc();
    
    @Query("SELECT AVG(r.percentage) FROM QuizResult r")
    Double findAveragePercentage();
    
    long countByQuizId(Long quizId);
    
    @Modifying
    @Transactional
    void deleteByQuizId(Long quizId);
}



