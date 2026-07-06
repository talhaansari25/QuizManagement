import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultComponent } from './components/result/result.component';
import { ResultsComponent } from './components/results/results.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { CreateQuizComponent } from './components/admin/create-quiz.component';
import { ManageQuizzesComponent } from './components/admin/manage-quizzes.component';
import { AdminResultsComponent } from './components/admin/admin-results.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'quiz/:id', component: QuizComponent },
  { path: 'result', component: ResultComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/create-quiz', component: CreateQuizComponent },
  { path: 'admin/quizzes', component: ManageQuizzesComponent },
  { path: 'admin/results', component: AdminResultsComponent },
  { path: '**', redirectTo: '/login' }
];
