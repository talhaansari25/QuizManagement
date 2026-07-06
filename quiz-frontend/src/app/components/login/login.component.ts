import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <!-- Role Selection Screen -->
      <div class="role-selection" *ngIf="!selectedRole">
        <h1>🎓 Quiz System</h1>
        <p>Please select how you want to login</p>

        <div class="role-cards">
          <div class="role-card user-card" (click)="selectRole('USER')">
            <div class="role-icon">👨‍🎓</div>
            <h3>Student</h3>
            <p>Take quizzes and view your results</p>
          </div>

          <div class="role-card admin-card" (click)="selectRole('ADMIN')">
            <div class="role-icon">👨‍💼</div>
            <h3>Admin</h3>
            <p>Create quizzes and manage the system</p>
          </div>
        </div>
      </div>

      <!-- Login/Register Form -->
      <div class="login-card" *ngIf="selectedRole">
        <button class="back-btn" (click)="goBack()">← Back</button>

        <div class="selected-role-badge" [class.admin]="selectedRole === 'ADMIN'">
          {{ selectedRole === 'ADMIN' ? '👨‍💼 Admin' : '👨‍🎓 Student' }} Login
        </div>

        <h2>{{ isRegister ? 'Register' : 'Login' }}</h2>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Username</label>
            <input type="text" [(ngModel)]="username" name="username" required placeholder="Enter username">
          </div>

          <div class="form-group" *ngIf="isRegister">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required placeholder="Enter email">
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="Enter password">
          </div>

          <div class="error" *ngIf="error">{{ error }}</div>

          <button type="submit" [disabled]="loading" class="submit-btn">
            {{ loading ? 'Please wait...' : (isRegister ? 'Register' : 'Login') }}
          </button>
        </form>

        <p class="toggle-text" *ngIf="selectedRole === 'USER'">
          {{ isRegister ? 'Already have an account?' : "Don't have an account?" }}
          <a (click)="toggleMode()">{{ isRegister ? 'Login' : 'Register' }}</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    /* Role Selection Styles */
    .role-selection {
      text-align: center;
      color: white;
    }
    .role-selection h1 {
      font-size: 42px;
      margin-bottom: 10px;
    }
    .role-selection > p {
      font-size: 18px;
      opacity: 0.9;
      margin-bottom: 40px;
    }
    .role-cards {
      display: flex;
      gap: 30px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .role-card {
      background: white;
      padding: 40px 50px;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
      min-width: 200px;
    }
    .role-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    .role-icon {
      font-size: 60px;
      margin-bottom: 15px;
    }
    .role-card h3 {
      color: #333;
      margin: 0 0 10px 0;
      font-size: 24px;
    }
    .role-card p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }
    .user-card:hover {
      border: 3px solid #27ae60;
    }
    .admin-card:hover {
      border: 3px solid #e74c3c;
    }

    /* Login Card Styles */
    .login-card {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 400px;
      position: relative;
    }
    .back-btn {
      position: absolute;
      top: 15px;
      left: 15px;
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
      font-size: 14px;
      padding: 5px 10px;
    }
    .back-btn:hover {
      text-decoration: underline;
    }
    .selected-role-badge {
      text-align: center;
      padding: 8px 15px;
      background: #e8f5e9;
      color: #27ae60;
      border-radius: 20px;
      font-weight: 600;
      margin-bottom: 20px;
      margin-top: 10px;
    }
    .selected-role-badge.admin {
      background: #ffebee;
      color: #e74c3c;
    }
    h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      color: #555;
      font-weight: 500;
    }
    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      box-sizing: border-box;
    }
    input:focus {
      outline: none;
      border-color: #667eea;
    }
    .submit-btn {
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
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .error {
      color: #e74c3c;
      margin-bottom: 15px;
      text-align: center;
      padding: 10px;
      background: #ffebee;
      border-radius: 5px;
    }
    .toggle-text {
      text-align: center;
      margin-top: 20px;
      color: #666;
    }
    .toggle-text a {
      color: #667eea;
      cursor: pointer;
      font-weight: 500;
    }
  `]
})
export class LoginComponent {
  username = '';
  email = '';
  password = '';
  isRegister = false;
  loading = false;
  error = '';
  selectedRole: 'USER' | 'ADMIN' | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  selectRole(role: 'USER' | 'ADMIN'): void {
    this.selectedRole = role;
    this.error = '';
    this.username = '';
    this.password = '';
    this.isRegister = false;
  }

  goBack(): void {
    this.selectedRole = null;
    this.error = '';
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    if (this.isRegister) {
      this.authService.register({ username: this.username, email: this.email, password: this.password })
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.error = err.error?.message || 'Registration failed';
            this.loading = false;
          }
        });
    } else {
      this.authService.login({ username: this.username, password: this.password })
        .subscribe({
          next: (response) => {
            // Verify role matches selection
            if (this.selectedRole === 'ADMIN' && response.role !== 'ADMIN') {
              this.error = 'This account does not have admin privileges';
              this.loading = false;
              this.authService.logout();
              return;
            }
            if (this.selectedRole === 'USER' && response.role === 'ADMIN') {
              this.error = 'Please use Admin login for admin accounts';
              this.loading = false;
              this.authService.logout();
              return;
            }

            // Redirect based on role
            if (response.role === 'ADMIN') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          },
          error: (err) => {
            this.error = err.error?.message || 'Login failed. Check your credentials.';
            this.loading = false;
          }
        });
    }
  }

  toggleMode(): void {
    this.isRegister = !this.isRegister;
    this.error = '';
  }
}


