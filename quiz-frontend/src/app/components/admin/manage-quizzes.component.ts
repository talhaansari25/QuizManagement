import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-manage-quizzes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="manage-quizzes">
      <nav class="navbar">
        <h1>📋 Manage Quizzes</h1>
        <div class="nav-actions">
          <button class="btn-create" (click)="goToCreateQuiz()">+ Create New</button>
          <button class="btn-back" (click)="goBack()">← Back</button>
        </div>
      </nav>

      <div class="content">
        <div class="loading" *ngIf="loading">Loading quizzes...</div>

        <div class="quizzes-grid" *ngIf="!loading">
          <div class="quiz-card" *ngFor="let quiz of quizzes">
            <div class="quiz-status" [class.active]="quiz.isActive" [class.inactive]="!quiz.isActive">
              {{ quiz.isActive ? 'Active' : 'Inactive' }}
            </div>
            <h3>{{ quiz.title }}</h3>
            <p>{{ quiz.description }}</p>
            <div class="quiz-meta">
              <span>⏱️ {{ quiz.timeLimitMinutes }} mins</span>
              <span>📝 {{ quiz.questionCount }} questions</span>
              <span>🏆 {{ quiz.totalMarks }} marks</span>
            </div>
            <div class="quiz-stats">
              <span>Attempts: {{ quiz.attemptCount || 0 }}</span>
              <span *ngIf="quiz.negativeMarking" class="negative">⚠️ Negative marking</span>
            </div>
            <div class="quiz-actions">
              <button class="btn-toggle" (click)="toggleQuizStatus(quiz)">
                {{ quiz.isActive ? 'Deactivate' : 'Activate' }}
              </button>
              <button class="btn-delete" (click)="deleteQuiz(quiz)">Delete</button>
            </div>
          </div>
        </div>

        <div class="no-quizzes" *ngIf="!loading && quizzes.length === 0">
          <p>No quizzes found.</p>
          <button class="btn-create-large" (click)="goToCreateQuiz()">Create Your First Quiz</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .manage-quizzes {
      min-height: 100vh;
      background: #1a1a2e;
    }
    .navbar {
      background: #16213e;
      color: white;
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #0f3460;
    }
    .navbar h1 {
      margin: 0;
      font-size: 22px;
    }
    .nav-actions {
      display: flex;
      gap: 10px;
    }
    .btn-create {
      padding: 8px 16px;
      background: #27ae60;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .btn-back {
      padding: 8px 16px;
      background: transparent;
      color: #94a3b8;
      border: 1px solid #0f3460;
      border-radius: 5px;
      cursor: pointer;
    }
    .content {
      padding: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .quizzes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }
    .quiz-card {
      background: #16213e;
      padding: 25px;
      border-radius: 10px;
      border: 1px solid #0f3460;
      position: relative;
    }
    .quiz-status {
      position: absolute;
      top: 15px;
      right: 15px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }
    .quiz-status.active {
      background: #27ae6020;
      color: #27ae60;
    }
    .quiz-status.inactive {
      background: #e74c3c20;
      color: #e74c3c;
    }
    .quiz-card h3 {
      color: white;
      margin: 0 0 10px 0;
      padding-right: 80px;
    }
    .quiz-card p {
      color: #94a3b8;
      margin: 0 0 15px 0;
      font-size: 14px;
    }
    .quiz-meta {
      display: flex;
      gap: 15px;
      margin-bottom: 10px;
      font-size: 13px;
      color: #64748b;
    }
    .quiz-stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      font-size: 13px;
      color: #64748b;
    }
    .negative {
      color: #e74c3c;
    }
    .quiz-actions {
      display: flex;
      gap: 10px;
    }
    .btn-toggle {
      flex: 1;
      padding: 10px;
      background: #0f3460;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .btn-delete {
      padding: 10px 15px;
      background: #e74c3c20;
      color: #e74c3c;
      border: 1px solid #e74c3c;
      border-radius: 5px;
      cursor: pointer;
    }
    .loading, .no-quizzes {
      text-align: center;
      padding: 50px;
      color: #94a3b8;
    }
    .btn-create-large {
      margin-top: 20px;
      padding: 15px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
    }
  `]
})
export class ManageQuizzesComponent implements OnInit {
  quizzes: any[] = [];
  loading = true;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.adminService.getAllQuizzesAdmin().subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load quizzes', err);
        this.loading = false;
      }
    });
  }

  toggleQuizStatus(quiz: any): void {
    this.adminService.toggleQuizStatus(quiz.id).subscribe({
      next: () => {
        quiz.isActive = !quiz.isActive;
      },
      error: (err) => console.error('Failed to toggle status', err)
    });
  }

  deleteQuiz(quiz: any): void {
    if (confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
      this.adminService.deleteQuiz(quiz.id).subscribe({
        next: () => {
          this.quizzes = this.quizzes.filter(q => q.id !== quiz.id);
        },
        error: (err) => console.error('Failed to delete quiz', err)
      });
    }
  }

  goToCreateQuiz(): void {
    this.router.navigate(['/admin/create-quiz']);
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}

