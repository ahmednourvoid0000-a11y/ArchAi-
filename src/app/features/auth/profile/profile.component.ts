import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { GoldButtonComponent } from '../../shared/components/gold-button/gold-button.component';
import { EditableFieldComponent } from '../../shared/components/editable-field/editable-field.component';
import { BackgroundGridComponent } from '../../shared/components/background-grid/background-grid.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    GoldButtonComponent,
    EditableFieldComponent,
    BackgroundGridComponent,
  ],
  template: `
    <div class="relative min-h-screen bg-arch-bg overflow-hidden">
      <app-background-grid [opacity]="0.16" />

      <!-- Top bar -->
      <header class="relative z-10 flex items-center justify-between px-6 py-4
                     border-b border-arch-border bg-arch-bg/80 backdrop-blur-sm">
        <a routerLink="/home"
          class="flex items-center gap-2 text-arch-muted hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="text-sm font-medium">Back</span>
        </a>

        <h1 class="font-display text-xl font-semibold text-white">Your Profile</h1>

        <!-- Logout -->
        <button type="button"
          class="flex items-center gap-1.5 text-arch-muted hover:text-red-400 transition-colors text-sm"
          (click)="logout()">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Logout
        </button>
      </header>

      <!-- Body -->
      <main class="relative z-10 max-w-md mx-auto px-6 pt-10 pb-16 animate-fade-up">

        <!-- Avatar -->
        <div class="flex flex-col items-center mb-10">
          <div class="w-24 h-24 rounded-full flex items-center justify-center
                      bg-gradient-to-br from-gold-light to-gold shadow-lg shadow-gold/20 mb-4">
            <svg class="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <p class="font-display text-xl font-semibold text-white">
            {{ firstName }} {{ lastName }}
          </p>
          <p class="text-arch-muted text-sm">{{ email }}</p>
        </div>

        <!-- Form card -->
        <div class="arch-card p-6 space-y-5">

          <div class="flex items-center gap-2 mb-2">
            <div class="w-1 h-5 bg-gold rounded-full"></div>
            <span class="text-xs uppercase tracking-widest text-arch-muted font-medium">
              Personal Info
            </span>
          </div>

          <!-- First Name -->
          <app-editable-field
            label="First Name"
            placeholder="John"
            [(ngModel)]="firstName"
          />

          <!-- Last Name -->
          <app-editable-field
            label="Last Name"
            placeholder="Doe"
            [(ngModel)]="lastName"
          />

          <!-- Email (read-only) -->
          <div class="flex flex-col gap-1.5">
            <label class="arch-label">Email</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-arch-muted">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </span>
              <input
                type="email"
                [value]="email"
                disabled
                class="arch-input pl-10 opacity-50 cursor-not-allowed"
                placeholder="email"
              />
            </div>
            <p class="text-arch-muted text-xs mt-0.5">Email cannot be changed here</p>
          </div>

          <!-- Update button -->
          <app-gold-button
            text="Update Profile"
            [loading]="loading()"
            (clicked)="updateProfile()"
          />
        </div>

        <!-- Success toast -->
        <div *ngIf="successMsg()"
          class="mt-4 flex items-center gap-2 bg-green-500/10 border border-green-500/30
                 rounded-xl px-4 py-3 text-green-400 text-sm animate-fade-up">
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ successMsg() }}
        </div>

        <!-- Error toast -->
        <div *ngIf="errorMsg()"
          class="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30
                 rounded-xl px-4 py-3 text-red-400 text-sm animate-fade-up">
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ errorMsg() }}
        </div>
      </main>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  firstName = '';
  lastName = '';
  email = '';

  loading = signal(false);
  successMsg = signal('');
  errorMsg = signal('');

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const uid = this.authService.currentUser?.uid;
    if (!uid) { this.router.navigateByUrl('/login'); return; }

    try {
      const userData = await this.userService.getUserData(uid);
      this.firstName = userData.firstName;
      this.lastName = userData.lastName;
      this.email = this.authService.currentUser?.email ?? userData.email;
    } catch {
      this.errorMsg.set('Failed to load profile data.');
    }
  }

  async updateProfile(): Promise<void> {
    const uid = this.authService.currentUser?.uid;
    if (!uid) return;

    this.loading.set(true);
    this.errorMsg.set('');

    try {
      await this.userService.updateUserData(uid, this.firstName.trim(), this.lastName.trim());
      this.successMsg.set('Profile updated successfully!');
      setTimeout(() => this.successMsg.set(''), 3500);
    } catch {
      this.errorMsg.set('Error updating profile. Please try again.');
      setTimeout(() => this.errorMsg.set(''), 4000);
    } finally {
      this.loading.set(false);
    }
  }

  async logout(): Promise<void> {
    await this.authService.signOut();
    this.userService.clearUserData();
    this.router.navigateByUrl('/login');
  }
}
