export interface Quiz {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
  totalQuestions: number;
  negativeMarking: boolean;
  negativeMarkValue: number;
}

export interface Option {
  id: number;
  optionText: string;
  optionKey: string;
}

export interface Question {
  id: number;
  questionText: string;
  marks: number;
  options: Option[];
  selectedOption?: string;
}

export interface QuizDetail {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
  negativeMarking: boolean;
  negativeMarkValue: number;
  questions: Question[];
}

export interface QuizResult {
  id: number;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  percentage: number;
  quizTitle: string;
  attemptedAt: string;
}

export interface AnswerDTO {
  questionId: number;
  selectedOptionKey: string;
}

export interface QuizSubmitRequest {
  quizId: number;
  userId: number;
  answers: AnswerDTO[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  userId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

