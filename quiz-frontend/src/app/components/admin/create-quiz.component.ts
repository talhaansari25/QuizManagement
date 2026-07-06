import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

interface QuestionForm {
  questionText: string;
  marks: number;
  options: { optionKey: string; optionText: string }[];
  correctKey: string;
}

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="create-quiz">
      <nav class="navbar">
        <h1>➕ Create New Quiz</h1>
        <button class="btn-back" (click)="goBack()">← Back to Dashboard</button>
      </nav>

      <div class="content">
        <div class="form-section">
          <h3>Quiz Details</h3>
          <div class="form-group">
            <label>Quiz Title *</label>
            <input type="text" [(ngModel)]="quizTitle" placeholder="e.g., Java Basics Quiz">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="quizDescription" placeholder="Brief description of the quiz"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Time Limit (minutes) *</label>
              <input type="number" [(ngModel)]="timeLimit" min="1" max="180">
            </div>
            <div class="form-group">
              <label>Passing Marks (%)</label>
              <input type="number" [(ngModel)]="passingPercentage" min="0" max="100">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" [(ngModel)]="negativeMarking">
                Enable Negative Marking
              </label>
            </div>
            <div class="form-group" *ngIf="negativeMarking">
              <label>Negative Mark Value</label>
              <input type="number" [(ngModel)]="negativeMarkValue" min="0" max="5" step="0.25">
            </div>
          </div>
        </div>

        <div class="questions-section">
          <div class="section-header">
            <h3>Questions ({{ questions.length }})</h3>
            <button class="btn-add" (click)="addQuestion()">+ Add Question</button>
          </div>

          <div class="question-card" *ngFor="let question of questions; let qi = index">
            <div class="question-header">
              <span>Question {{ qi + 1 }}</span>
              <button class="btn-remove" (click)="removeQuestion(qi)">🗑️</button>
            </div>

            <div class="form-group">
              <label>Question Text *</label>
              <textarea [(ngModel)]="question.questionText" placeholder="Enter your question"></textarea>
            </div>

            <div class="form-group">
              <label>Marks *</label>
              <input type="number" [(ngModel)]="question.marks" min="1" max="10">
            </div>

            <div class="options-section">
              <label>Options *</label>
              <div class="option-row" *ngFor="let option of question.options; let oi = index">
                <span class="option-key">{{ option.optionKey }}</span>
                <input type="text" [(ngModel)]="option.optionText" placeholder="Option text">
                <label class="correct-label">
                  <input
                    type="radio"
                    [name]="'correct-' + qi"
                    [value]="option.optionKey"
                    [(ngModel)]="question.correctKey">
                  Correct
                </label>
              </div>
            </div>
          </div>

          <div class="no-questions" *ngIf="questions.length === 0">
            No questions added yet. Click "Add Question" to start.
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-cancel" (click)="goBack()">Cancel</button>
          <button class="btn-save" (click)="saveQuiz()" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Save Quiz' }}
          </button>
        </div>

        <div class="error" *ngIf="error">{{ error }}</div>
        <div class="success" *ngIf="success">{{ success }}</div>
      </div>
    </div>
  `,
  styles: [`
    .create-quiz {
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
    .btn-back:hover {
      background: #0f3460;
    }
    .content {
      padding: 30px;
      max-width: 900px;
      margin: 0 auto;
    }
    .form-section, .questions-section {
      background: #16213e;
      padding: 25px;
      border-radius: 10px;
      margin-bottom: 20px;
      border: 1px solid #0f3460;
    }
    h3 {
      color: white;
      margin: 0 0 20px 0;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      color: #94a3b8;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .form-group input[type="text"],
    .form-group input[type="number"],
    .form-group textarea {
      width: 100%;
      padding: 12px;
      background: #1a1a2e;
      border: 1px solid #0f3460;
      border-radius: 5px;
      color: white;
      font-size: 14px;
      box-sizing: border-box;
    }
    .form-group textarea {
      min-height: 80px;
      resize: vertical;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    .checkbox-group input[type="checkbox"] {
      width: 18px;
      height: 18px;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .btn-add {
      padding: 10px 20px;
      background: #27ae60;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .question-card {
      background: #1a1a2e;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 15px;
      border: 1px solid #0f3460;
    }
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      color: #667eea;
      font-weight: bold;
    }
    .btn-remove {
      background: transparent;
      border: none;
      font-size: 18px;
      cursor: pointer;
    }
    .options-section {
      margin-top: 15px;
    }
    .options-section > label {
      color: #94a3b8;
      margin-bottom: 10px;
      display: block;
    }
    .option-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .option-key {
      width: 30px;
      height: 30px;
      background: #0f3460;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      font-weight: bold;
    }
    .option-row input[type="text"] {
      flex: 1;
      padding: 10px;
      background: #16213e;
      border: 1px solid #0f3460;
      border-radius: 5px;
      color: white;
    }
    .correct-label {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #94a3b8;
      font-size: 13px;
      cursor: pointer;
    }
    .no-questions {
      color: #94a3b8;
      text-align: center;
      padding: 30px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
    }
    .btn-cancel {
      padding: 12px 30px;
      background: transparent;
      color: #94a3b8;
      border: 1px solid #0f3460;
      border-radius: 5px;
      cursor: pointer;
    }
    .btn-save {
      padding: 12px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .btn-save:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .error {
      margin-top: 20px;
      padding: 15px;
      background: #e74c3c20;
      border: 1px solid #e74c3c;
      border-radius: 5px;
      color: #e74c3c;
    }
    .success {
      margin-top: 20px;
      padding: 15px;
      background: #27ae6020;
      border: 1px solid #27ae60;
      border-radius: 5px;
      color: #27ae60;
    }
  `]
})
export class CreateQuizComponent {
  quizTitle = '';
  quizDescription = '';
  timeLimit = 15;
  passingPercentage = 50;
  negativeMarking = false;
  negativeMarkValue = 0.25;
  questions: QuestionForm[] = [];
  saving = false;
  error = '';
  success = '';

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  addQuestion(): void {
    this.questions.push({
      questionText: '',
      marks: 2,
      options: [
        { optionKey: 'A', optionText: '' },
        { optionKey: 'B', optionText: '' },
        { optionKey: 'C', optionText: '' },
        { optionKey: 'D', optionText: '' }
      ],
      correctKey: 'A'
    });
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  saveQuiz(): void {
    this.error = '';
    this.success = '';

    // Validation
    if (!this.quizTitle.trim()) {
      this.error = 'Quiz title is required';
      return;
    }
    if (this.questions.length === 0) {
      this.error = 'Add at least one question';
      return;
    }
    for (let i = 0; i < this.questions.length; i++) {
      const q = this.questions[i];
      if (!q.questionText.trim()) {
        this.error = `Question ${i + 1}: Question text is required`;
        return;
      }
      if (q.options.some(o => !o.optionText.trim())) {
        this.error = `Question ${i + 1}: All options must have text`;
        return;
      }
    }

    this.saving = true;
    const totalMarks = this.questions.reduce((sum, q) => sum + q.marks, 0);
    const passingMarks = (this.passingPercentage / 100) * totalMarks;

    const quizData = {
      title: this.quizTitle,
      description: this.quizDescription,
      timeLimitMinutes: this.timeLimit,
      totalMarks: totalMarks,
      passingMarks: passingMarks,
      negativeMarking: this.negativeMarking,
      negativeMarkValue: this.negativeMarking ? this.negativeMarkValue : 0,
      questions: this.questions.map(q => ({
        questionText: q.questionText,
        marks: q.marks,
        correctKey: q.correctKey,
        options: q.options.map(o => ({
          optionKey: o.optionKey,
          optionText: o.optionText
        }))
      }))
    };

    this.adminService.createQuiz(quizData).subscribe({
      next: () => {
        this.success = 'Quiz created successfully!';
        this.saving = false;
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1500);
      },
      error: (err) => {
        this.error = 'Failed to create quiz. Please try again.';
        this.saving = false;
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}

