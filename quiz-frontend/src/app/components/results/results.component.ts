import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';
import { QuizResult } from '../../models/quiz.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-page">
      <nav class="navbar">
        <h1>Quiz System</h1>
        <button (click)="goToDashboard()">← Back to Dashboard</button>
      </nav>

      <div class="content">
        <h2>My Quiz Results</h2>

        <div class="loading" *ngIf="loading">Loading results...</div>
        <div class="error" *ngIf="error">{{ error }}</div>

        <div class="results-list" *ngIf="!loading && !error">
          <div class="result-card" *ngFor="let result of results">
            <div class="result-header">
              <h3>{{ result.quizTitle }}</h3>
              <span class="date">{{ result.attemptedAt | date:'medium' }}</span>
            </div>
            <div class="result-body">
              <div class="score-badge" [class.pass]="result.percentage >= 50" [class.fail]="result.percentage < 50">
                {{ result.percentage | number:'1.1-1' }}%
              </div>
              <div class="stats">
                <div class="stat">
                  <span class="label">Score</span>
                  <span class="value">{{ result.score }} / {{ result.totalMarks }}</span>
                </div>
                <div class="stat">
                  <span class="label">Correct</span>
                  <span class="value correct">{{ result.correctAnswers }}</span>
                </div>
                <div class="stat">
                  <span class="label">Wrong</span>
                  <span class="value wrong">{{ result.wrongAnswers }}</span>
                </div>
                <div class="stat">
                  <span class="label">Skipped</span>
                  <span class="value">{{ result.unanswered }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="no-results" *ngIf="results.length === 0">
            <p>You haven't attempted any quizzes yet.</p>
            <button (click)="goToDashboard()">Take a Quiz</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .results-page {
      min-height: 100vh;
      background: #f5f6fa;
    }
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .navbar h1 {
      margin: 0;
    }
    .navbar button {
      padding: 8px 16px;
      background: rgba(255,255,255,0.2);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .content {
      padding: 30px;
      max-width: 900px;
      margin: 0 auto;
    }
    .content h2 {
      color: #333;
      margin-bottom: 20px;
    }
    .results-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .result-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .result-header {
      padding: 15px 20px;
      background: #f8f9fa;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .result-header h3 {
      margin: 0;
      color: #333;
    }
    .date {
      color: #888;
      font-size: 14px;
    }
    .result-body {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 30px;
    }
    .score-badge {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      color: white;
    }
    .score-badge.pass {
      background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
    }
    .score-badge.fail {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    }
    .stats {
      display: flex;
      gap: 30px;
      flex: 1;
    }
    .stat {
      display: flex;
      flex-direction: column;
    }
    .stat .label {
      color: #888;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .stat .value {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .stat .value.correct {
      color: #27ae60;
    }
    .stat .value.wrong {
      color: #e74c3c;
    }
    .loading, .error, .no-results {
      text-align: center;
      padding: 50px;
      background: white;
      border-radius: 10px;
    }
    .error {
      color: #e74c3c;
    }
    .no-results button {
      margin-top: 20px;
      padding: 12px 25px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  `]
})
export class ResultsComponent implements OnInit {
  results: QuizResult[] = [];
  loading = true;
  error = '';

  constructor(
    private quizService: QuizService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.error = 'User not found';
      this.loading = false;
      return;
    }

    this.quizService.getUserResults(userId).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load results';
        this.loading = false;
        console.error(err);
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}

