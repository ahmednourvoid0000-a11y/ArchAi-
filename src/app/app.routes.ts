import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ── Public ──────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./features/splash/splash.component').then((m) => m.SplashComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component').then((m) => m.SignupComponent),
  },

  // ── Protected ────────────────────────────────────────────────
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home-screen.component').then((m) => m.HomeScreenComponent),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/auth/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'bot',
    loadComponent: () =>
      import('./features/chat/bot-screen.component').then((m) => m.BotScreenComponent),
    canActivate: [authGuard],
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./features/chat/chat-screen.component').then((m) => m.ChatScreenComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings-screen.component').then((m) => m.SettingsScreenComponent),
    canActivate: [authGuard],
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./features/projects/projects-screen.component').then((m) => m.ProjectsScreenComponent),
    canActivate: [authGuard],
  },
  {
    path: 'projects/:id',
    loadComponent: () =>
      import('./features/projects/project-details.component').then((m) => m.ProjectDetailsComponent),
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: '' },
];
