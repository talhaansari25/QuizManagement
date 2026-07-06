import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/stats`).pipe(
      map(response => response.success ? response.data : {
        totalQuizzes: 0,
        totalUsers: 0,
        totalAttempts: 0,
        averageScore: 0
      })
    );
  }

  getAllResults(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/admin/results`).pipe(
      map(response => response.success ? response.data : [])
    );
  }

  getAllQuizzesAdmin(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/admin/quizzes`).pipe(
      map(response => response.success ? response.data : [])
    );
  }

  createQuiz(quizData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/quiz`, quizData).pipe(
      map(response => response.data)
    );
  }

  toggleQuizStatus(quizId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/quiz/${quizId}/toggle`, {});
  }

  deleteQuiz(quizId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/quiz/${quizId}`);
  }
}

