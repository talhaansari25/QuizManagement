import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Quiz, QuizDetail, QuizResult, QuizSubmitRequest, ApiResponse } from '../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/quiz`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data.map(q => ({
            id: q.id,
            title: q.title,
            description: q.description,
            timeLimit: q.timeLimitMinutes,
            totalQuestions: q.questionCount,
            negativeMarking: q.negativeMarking,
            negativeMarkValue: q.negativeMarkValue
          }));
        }
        return [];
      })
    );
  }

  getQuizById(id: number): Observable<QuizDetail> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/quiz/${id}`).pipe(
      map(response => {
        if (response.success && response.data) {
          const q = response.data;
          return {
            id: q.id,
            title: q.title,
            description: q.description,
            timeLimit: q.timeLimitMinutes,
            negativeMarking: q.negativeMarking,
            negativeMarkValue: q.negativeMarkValue,
            questions: q.questions.map((question: any) => ({
              id: question.id,
              questionText: question.questionText,
              marks: question.marks,
              options: question.options.map((opt: any) => ({
                id: opt.id,
                optionText: opt.optionText,
                optionKey: opt.optionKey
              }))
            }))
          };
        }
        throw new Error('Failed to load quiz');
      })
    );
  }

  submitQuiz(submitData: QuizSubmitRequest): Observable<QuizResult> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/quiz/submit`, submitData).pipe(
      map(response => {
        if (response.success && response.data) {
          const r = response.data;
          return {
            id: r.id,
            score: r.score,
            totalMarks: r.totalMarks,
            correctAnswers: r.correctAnswers,
            wrongAnswers: r.wrongAnswers,
            unanswered: r.unanswered,
            percentage: r.percentage,
            quizTitle: r.quizTitle,
            attemptedAt: r.attemptedAt
          };
        }
        throw new Error('Failed to submit quiz');
      })
    );
  }

  getUserResults(userId: number): Observable<QuizResult[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/result/${userId}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data.map(r => ({
            id: r.id,
            score: r.score,
            totalMarks: r.totalMarks,
            correctAnswers: r.correctAnswers,
            wrongAnswers: r.wrongAnswers,
            unanswered: r.unanswered,
            percentage: r.percentage,
            quizTitle: r.quizTitle,
            attemptedAt: r.attemptedAt
          }));
        }
        return [];
      })
    );
  }
}


