import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard">
      <nav class="navbar">
        <h1>🎓 Quiz Admin Panel</h1>
        <div class="nav-right">
          <span>Admin: {{ currentUser?.username }}</span>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
      </nav>

      <div class="content">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-info">
              <span class="stat-value">{{ totalQuizzes }}</span>
              <span class="stat-label">Total Quizzes</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <span class="stat-value">{{ totalUsers }}</span>
              <span class="stat-label">Total Users</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <span class="stat-value">{{ totalAttempts }}</span>
              <span class="stat-label">Quiz Attempts</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <span class="stat-value">{{ averageScore | number:'1.1-1' }}%</span>
              <span class="stat-label">Avg. Score</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn-primary" (click)="goToCreateQuiz()">
            ➕ Create New Quiz
          </button>
          <button class="btn-secondary" (click)="goToManageQuizzes()">
            📋 Manage Quizzes
          </button>
          <button class="btn-secondary" (click)="goToAllResults()">
            📈 View All Results
          </button>
        </div>

        <div class="recent-section">
          <h3>Recent Quiz Attempts</h3>
          <div class="results-table" *ngIf="recentResults.length > 0">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Quiz</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let result of recentResults">
                  <td>{{ result.username }}</td>
                  <td>{{ result.quizTitle }}</td>
                  <td>{{ result.score }}/{{ result.totalMarks }}</td>
                  <td [class.pass]="result.percentage >= 50" [class.fail]="result.percentage < 50">
                    {{ result.percentage | number:'1.1-1' }}%
                  </td>
                  <td>{{ result.attemptedAt | date:'short' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="no-data" *ngIf="recentResults.length === 0">
            No quiz attempts yet.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      min-height: 100vh;
      background: #1a1a2e;
    }
    .navbar {
      background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%);
      color: white;
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #0f3460;
    }
    .navbar h1 {
      margin: 0;
      font-size: 24px;
    }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 15px;
      color: #94a3b8;
    }
    .btn-logout {
      padding: 8px 16px;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .content {
      padding: 30px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: #16213e;
      padding: 25px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 20px;
      border: 1px solid #0f3460;
    }
    .stat-icon {
      font-size: 40px;
    }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: white;
    }
    .stat-label {
      color: #94a3b8;
      font-size: 14px;
    }
    .action-buttons {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    .btn-primary {
      padding: 15px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
    }
    .btn-secondary {
      padding: 15px 30px;
      background: #16213e;
      color: white;
      border: 1px solid #0f3460;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-secondary:hover {
      background: #0f3460;
    }
    .recent-section {
      background: #16213e;
      padding: 25px;
      border-radius: 10px;
      border: 1px solid #0f3460;
    }
    .recent-section h3 {
      color: white;
      margin: 0 0 20px 0;
    }
    .results-table {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #0f3460;
    }
    th {
      color: #94a3b8;
      font-weight: 500;
    }
    td {
      color: white;
    }
    .pass {
      color: #27ae60;
      font-weight: bold;
    }
    .fail {
      color: #e74c3c;
      font-weight: bold;
    }
    .no-data {
      color: #94a3b8;
      text-align: center;
      padding: 30px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  currentUser: any;
  totalQuizzes = 0;
  totalUsers = 0;
  totalAttempts = 0;
  averageScore = 0;
  recentResults: any[] = [];

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loadStats();
    this.loadRecentResults();
  }

  loadStats(): void {
    this.adminService.getStats().subscribe({
      next: (stats) => {
        this.totalQuizzes = stats.totalQuizzes;
        this.totalUsers = stats.totalUsers;
        this.totalAttempts = stats.totalAttempts;
        this.averageScore = stats.averageScore;
      },
      error: (err) => console.error('Failed to load stats', err)
    });
  }

  loadRecentResults(): void {
    this.adminService.getAllResults().subscribe({
      next: (results) => {
        this.recentResults = results.slice(0, 10);
      },
      error: (err) => console.error('Failed to load results', err)
    });
  }

  goToCreateQuiz(): void {
    this.router.navigate(['/admin/create-quiz']);
  }

  goToManageQuizzes(): void {
    this.router.navigate(['/admin/quizzes']);
  }

  goToAllResults(): void {
    this.router.navigate(['/admin/results']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

