import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';
import { QuizDetail, Question, AnswerDTO } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quiz-container" *ngIf="quiz">
      <div class="quiz-header">
        <h2>{{ quiz.title }}</h2>
        <div class="timer" [class.warning]="timeRemaining < 60">
          ⏱️ {{ formatTime(timeRemaining) }}
        </div>
      </div>

      <div class="progress-bar">
        <div class="progress" [style.width.%]="(currentQuestionIndex + 1) / quiz.questions.length * 100"></div>
      </div>

      <div class="question-container" *ngIf="currentQuestion">
        <div class="question-header">
          <span>Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions.length }}</span>
          <span class="marks">{{ currentQuestion.marks }} marks</span>
        </div>

        <div class="question-text">
          {{ currentQuestion.questionText }}
        </div>

        <div class="options">
          <div
            class="option"
            *ngFor="let option of currentQuestion.options"
            [class.selected]="currentQuestion.selectedOption === option.optionKey"
            (click)="selectOption(option.optionKey)">
            <span class="option-key">{{ option.optionKey }}</span>
            <span class="option-text">{{ option.optionText }}</span>
          </div>
        </div>
      </div>

      <div class="navigation">
        <button class="btn-prev" (click)="previousQuestion()" [disabled]="currentQuestionIndex === 0">
          ← Previous
        </button>
        <button class="btn-next" (click)="nextQuestion()" *ngIf="currentQuestionIndex < quiz.questions.length - 1">
          Next →
        </button>
        <button class="btn-submit" (click)="submitQuiz()" *ngIf="currentQuestionIndex === quiz.questions.length - 1">
          Submit Quiz
        </button>
      </div>

      <div class="question-nav">
        <span>Jump to question:</span>
        <div class="question-numbers">
          <button
            *ngFor="let q of quiz.questions; let i = index"
            [class.current]="i === currentQuestionIndex"
            [class.answered]="q.selectedOption"
            (click)="goToQuestion(i)">
            {{ i + 1 }}
          </button>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="loading">Loading quiz...</div>
    <div class="error" *ngIf="error">{{ error }}</div>
  `,
  styles: [`
    .quiz-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
    }
    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .quiz-header h2 {
      margin: 0;
      color: #333;
    }
    .timer {
      background: #667eea;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 18px;
      font-weight: bold;
    }
    .timer.warning {
      background: #e74c3c;
      animation: pulse 1s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    .progress-bar {
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      margin-bottom: 30px;
      overflow: hidden;
    }
    .progress {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }
    .question-container {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .question-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      color: #888;
    }
    .marks {
      background: #e8f5e9;
      color: #2e7d32;
      padding: 4px 10px;
      border-radius: 4px;
    }
    .question-text {
      font-size: 18px;
      color: #333;
      margin-bottom: 25px;
      line-height: 1.6;
    }
    .options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .option {
      display: flex;
      align-items: center;
      padding: 15px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .option:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }
    .option.selected {
      border-color: #667eea;
      background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
    }
    .option-key {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f0f0;
      border-radius: 50%;
      margin-right: 15px;
      font-weight: bold;
      color: #666;
    }
    .option.selected .option-key {
      background: #667eea;
      color: white;
    }
    .navigation {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .navigation button {
      padding: 12px 25px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-prev {
      background: #e0e0e0;
      color: #333;
    }
    .btn-next {
      background: #667eea;
      color: white;
    }
    .btn-submit {
      background: #27ae60;
      color: white;
    }
    .navigation button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .question-nav {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .question-nav span {
      color: #666;
      margin-bottom: 10px;
      display: block;
    }
    .question-numbers {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .question-numbers button {
      width: 36px;
      height: 36px;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 500;
    }
    .question-numbers button.current {
      border-color: #667eea;
      background: #667eea;
      color: white;
    }
    .question-numbers button.answered {
      background: #e8f5e9;
      border-color: #27ae60;
    }
    .loading, .error {
      text-align: center;
      padding: 50px;
      font-size: 18px;
    }
    .error {
      color: #e74c3c;
    }
  `]
})
export class QuizComponent implements OnInit, OnDestroy {
  quiz: QuizDetail | null = null;
  currentQuestionIndex = 0;
  timeRemaining = 0;
  timerInterval: any;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const quizId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQuiz(quizId);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  loadQuiz(quizId: number): void {
    this.quizService.getQuizById(quizId).subscribe({
      next: (data) => {
        this.quiz = data;
        this.timeRemaining = data.timeLimit * 60;
        this.startTimer();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load quiz';
        this.loading = false;
        console.error(err);
      }
    });
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.submitQuiz();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  get currentQuestion(): Question | null {
    return this.quiz?.questions[this.currentQuestionIndex] || null;
  }

  selectOption(optionKey: string): void {
    if (this.currentQuestion) {
      this.currentQuestion.selectedOption = optionKey;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  nextQuestion(): void {
    if (this.quiz && this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  goToQuestion(index: number): void {
    this.currentQuestionIndex = index;
  }

  submitQuiz(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    if (!this.quiz) return;

    const answers: AnswerDTO[] = this.quiz.questions
      .filter(q => q.selectedOption)
      .map(q => ({
        questionId: q.id,
        selectedOptionKey: q.selectedOption!
      }));

    const submitData = {
      quizId: this.quiz.id,
      userId: this.authService.getUserId()!,
      answers: answers
    };

    this.quizService.submitQuiz(submitData).subscribe({
      next: (result) => {
        this.router.navigate(['/result'], { state: { result: result } });
      },
      error: (err) => {
        this.error = 'Failed to submit quiz';
        console.error(err);
      }
    });
  }
}


