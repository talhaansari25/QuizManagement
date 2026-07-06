import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizResult } from '../../models/quiz.model';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="result-container" *ngIf="result">
      <div class="result-card">
        <div class="result-icon" [class.pass]="result.percentage >= 50" [class.fail]="result.percentage < 50">
          {{ result.percentage >= 50 ? '🎉' : '😔' }}
        </div>

        <h2>{{ result.percentage >= 50 ? 'Congratulations!' : 'Better Luck Next Time!' }}</h2>
        <p class="quiz-title">{{ result.quizTitle }}</p>

        <div class="score-circle" [class.pass]="result.percentage >= 50" [class.fail]="result.percentage < 50">
          <span class="percentage">{{ result.percentage | number:'1.1-1' }}%</span>
          <span class="label">Score</span>
        </div>

        <div class="stats">
          <div class="stat">
            <span class="value">{{ result.score }}</span>
            <span class="label">Points Scored</span>
          </div>
          <div class="stat">
            <span class="value">{{ result.totalMarks }}</span>
            <span class="label">Total Marks</span>
          </div>
        </div>

        <div class="breakdown">
          <div class="breakdown-item correct">
            <span class="icon">✓</span>
            <span class="count">{{ result.correctAnswers }}</span>
            <span class="text">Correct</span>
          </div>
          <div class="breakdown-item wrong">
            <span class="icon">✗</span>
            <span class="count">{{ result.wrongAnswers }}</span>
            <span class="text">Wrong</span>
          </div>
          <div class="breakdown-item unanswered">
            <span class="icon">○</span>
            <span class="count">{{ result.unanswered }}</span>
            <span class="text">Skipped</span>
          </div>
        </div>

        <div class="actions">
          <button class="btn-dashboard" (click)="goToDashboard()">Back to Dashboard</button>
          <button class="btn-results" (click)="viewAllResults()">View All Results</button>
        </div>
      </div>
    </div>

    <div class="no-result" *ngIf="!result">
      <p>No result data available</p>
      <button (click)="goToDashboard()">Go to Dashboard</button>
    </div>
  `,
  styles: [`
    .result-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .result-card {
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      text-align: center;
      max-width: 500px;
      width: 100%;
    }
    .result-icon {
      font-size: 60px;
      margin-bottom: 10px;
    }
    h2 {
      color: #333;
      margin: 0 0 5px 0;
    }
    .quiz-title {
      color: #888;
      margin-bottom: 30px;
    }
    .score-circle {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 auto 30px;
    }
    .score-circle.pass {
      background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
    }
    .score-circle.fail {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    }
    .score-circle .percentage {
      font-size: 36px;
      font-weight: bold;
      color: white;
    }
    .score-circle .label {
      color: rgba(255,255,255,0.8);
      font-size: 14px;
    }
    .stats {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-bottom: 30px;
    }
    .stat {
      display: flex;
      flex-direction: column;
    }
    .stat .value {
      font-size: 28px;
      font-weight: bold;
      color: #333;
    }
    .stat .label {
      color: #888;
      font-size: 14px;
    }
    .breakdown {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 30px;
    }
    .breakdown-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .breakdown-item .icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .breakdown-item.correct .icon {
      background: #e8f5e9;
      color: #27ae60;
    }
    .breakdown-item.wrong .icon {
      background: #ffebee;
      color: #e74c3c;
    }
    .breakdown-item.unanswered .icon {
      background: #f5f5f5;
      color: #888;
    }
    .breakdown-item .count {
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }
    .breakdown-item .text {
      color: #888;
      font-size: 12px;
    }
    .actions {
      display: flex;
      gap: 15px;
      justify-content: center;
    }
    .actions button {
      padding: 12px 25px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .btn-dashboard {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .btn-results {
      background: #f0f0f0;
      color: #333;
    }
    .actions button:hover {
      transform: translateY(-2px);
    }
    .no-result {
      text-align: center;
      padding: 50px;
    }
    .no-result button {
      padding: 12px 25px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  `]
})
export class ResultComponent implements OnInit {
  result: QuizResult | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.result = navigation.extras.state['result'];
    }
  }

  ngOnInit(): void {
    if (!this.result) {
      const state = history.state;
      if (state?.result) {
        this.result = state.result;
      }
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  viewAllResults(): void {
    this.router.navigate(['/results']);
  }
}

