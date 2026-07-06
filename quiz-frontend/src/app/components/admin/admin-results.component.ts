import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-results">
      <nav class="navbar">
        <h1>📈 All Quiz Results</h1>
        <button class="btn-back" (click)="goBack()">← Back to Dashboard</button>
      </nav>

      <div class="content">
        <div class="filters">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Search by username or quiz..."
            (input)="filterResults()">
          <select [(ngModel)]="quizFilter" (change)="filterResults()">
            <option value="">All Quizzes</option>
            <option *ngFor="let quiz of quizNames" [value]="quiz">{{ quiz }}</option>
          </select>
        </div>

        <div class="stats-bar">
          <div class="stat">
            <span class="value">{{ filteredResults.length }}</span>
            <span class="label">Total Attempts</span>
          </div>
          <div class="stat">
            <span class="value">{{ getAverageScore() | number:'1.1-1' }}%</span>
            <span class="label">Average Score</span>
          </div>
          <div class="stat">
            <span class="value">{{ getPassRate() | number:'1.0-0' }}%</span>
            <span class="label">Pass Rate</span>
          </div>
        </div>

        <div class="results-table" *ngIf="filteredResults.length > 0">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Quiz</th>
                <th>Score</th>
                <th>Correct</th>
                <th>Wrong</th>
                <th>Skipped</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let result of filteredResults; let i = index">
                <td class="rank">{{ i + 1 }}</td>
                <td>{{ result.username }}</td>
                <td>{{ result.quizTitle }}</td>
                <td>{{ result.score }}/{{ result.totalMarks }}</td>
                <td class="correct">{{ result.correctAnswers }}</td>
                <td class="wrong">{{ result.wrongAnswers }}</td>
                <td>{{ result.unanswered }}</td>
                <td [class.pass]="result.percentage >= 50" [class.fail]="result.percentage < 50">
                  {{ result.percentage | number:'1.1-1' }}%
                </td>
                <td>
                  <span class="status-badge" [class.passed]="result.passed" [class.failed]="!result.passed">
                    {{ result.passed ? 'PASSED' : 'FAILED' }}
                  </span>
                </td>
                <td>{{ result.attemptedAt | date:'short' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="no-results" *ngIf="filteredResults.length === 0 && !loading">
          No results found.
        </div>

        <div class="loading" *ngIf="loading">Loading results...</div>
      </div>
    </div>
  `,
  styles: [`
    .admin-results {
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
      max-width: 1400px;
      margin: 0 auto;
    }
    .filters {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }
    .filters input, .filters select {
      padding: 12px 15px;
      background: #16213e;
      border: 1px solid #0f3460;
      border-radius: 5px;
      color: white;
      font-size: 14px;
    }
    .filters input {
      flex: 1;
      max-width: 300px;
    }
    .filters select {
      min-width: 200px;
    }
    .stats-bar {
      display: flex;
      gap: 30px;
      margin-bottom: 25px;
      padding: 20px;
      background: #16213e;
      border-radius: 10px;
      border: 1px solid #0f3460;
    }
    .stats-bar .stat {
      display: flex;
      flex-direction: column;
    }
    .stats-bar .value {
      font-size: 24px;
      font-weight: bold;
      color: white;
    }
    .stats-bar .label {
      color: #94a3b8;
      font-size: 13px;
    }
    .results-table {
      background: #16213e;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #0f3460;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid #0f3460;
    }
    th {
      background: #0f3460;
      color: #94a3b8;
      font-weight: 500;
      font-size: 13px;
      text-transform: uppercase;
    }
    td {
      color: white;
      font-size: 14px;
    }
    .rank {
      font-weight: bold;
      color: #667eea;
    }
    .correct {
      color: #27ae60;
    }
    .wrong {
      color: #e74c3c;
    }
    .pass {
      color: #27ae60;
      font-weight: bold;
    }
    .fail {
      color: #e74c3c;
      font-weight: bold;
    }
    .status-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
    }
    .status-badge.passed {
      background: #27ae6020;
      color: #27ae60;
    }
    .status-badge.failed {
      background: #e74c3c20;
      color: #e74c3c;
    }
    .no-results, .loading {
      text-align: center;
      padding: 50px;
      color: #94a3b8;
    }
  `]
})
export class AdminResultsComponent implements OnInit {
  allResults: any[] = [];
  filteredResults: any[] = [];
  quizNames: string[] = [];
  searchTerm = '';
  quizFilter = '';
  loading = true;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    this.adminService.getAllResults().subscribe({
      next: (results) => {
        this.allResults = results.sort((a, b) => b.percentage - a.percentage);
        this.filteredResults = [...this.allResults];
        this.quizNames = [...new Set(results.map(r => r.quizTitle))];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load results', err);
        this.loading = false;
      }
    });
  }

  filterResults(): void {
    this.filteredResults = this.allResults.filter(r => {
      const matchesSearch = !this.searchTerm ||
        r.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.quizTitle.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesQuiz = !this.quizFilter || r.quizTitle === this.quizFilter;
      return matchesSearch && matchesQuiz;
    });
  }

  getAverageScore(): number {
    if (this.filteredResults.length === 0) return 0;
    const sum = this.filteredResults.reduce((acc, r) => acc + r.percentage, 0);
    return sum / this.filteredResults.length;
  }

  getPassRate(): number {
    if (this.filteredResults.length === 0) return 0;
    const passed = this.filteredResults.filter(r => r.passed).length;
    return (passed / this.filteredResults.length) * 100;
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}

