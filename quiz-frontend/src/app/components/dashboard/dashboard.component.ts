import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { QuizService } from '../../services/quiz.service';
import { Quiz } from '../../models/quiz.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <nav class="navbar">
        <h1>Quiz System</h1>
        <div class="nav-right">
          <span>Welcome, {{ currentUser?.username }}</span>
          <button class="btn-results" (click)="viewResults()">My Results</button>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
      </nav>

      <div class="content">
        <h2>Available Quizzes</h2>

        <div class="loading" *ngIf="loading">Loading quizzes...</div>
        <div class="error" *ngIf="error">{{ error }}</div>

        <div class="quiz-grid" *ngIf="!loading && !error">
          <div class="quiz-card" *ngFor="let quiz of quizzes">
            <h3>{{ quiz.title }}</h3>
            <p>{{ quiz.description }}</p>
            <div class="quiz-info">
              <span>⏱️ {{ quiz.timeLimit }} mins</span>
              <span>📝 {{ quiz.totalQuestions }} questions</span>
              <span *ngIf="quiz.negativeMarking" class="negative">⚠️ Negative marking</span>
            </div>
            <button (click)="startQuiz(quiz.id)">Start Quiz</button>
          </div>

          <div class="no-quizzes" *ngIf="quizzes.length === 0">
            No quizzes available at the moment.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
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
    .nav-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .btn-results, .btn-logout {
      padding: 8px 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 500;
    }
    .btn-results {
      background: white;
      color: #667eea;
    }
    .btn-logout {
      background: rgba(255,255,255,0.2);
      color: white;
    }
    .content {
      padding: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .content h2 {
      color: #333;
      margin-bottom: 20px;
    }
    .quiz-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .quiz-card {
      background: white;
      padding: 25px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .quiz-card h3 {
      margin: 0 0 10px 0;
      color: #333;
    }
    .quiz-card p {
      color: #666;
      margin-bottom: 15px;
    }
    .quiz-info {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #888;
    }
    .negative {
      color: #e74c3c;
    }
    .quiz-card button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .quiz-card button:hover {
      transform: translateY(-2px);
    }
    .loading, .error, .no-quizzes {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    .error {
      color: #e74c3c;
    }
  `]
})
export class DashboardComponent implements OnInit {
  quizzes: Quiz[] = [];
  loading = true;
  error = '';
  currentUser: any;

  constructor(
    private quizService: QuizService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe({
      next: (data) => {
        this.quizzes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load quizzes';
        this.loading = false;
        console.error(err);
      }
    });
  }

  startQuiz(quizId: number): void {
    this.router.navigate(['/quiz', quizId]);
  }

  viewResults(): void {
    this.router.navigate(['/results']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

