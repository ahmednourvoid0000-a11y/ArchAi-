import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { Validators } from '../../../core/validators';
import { GoldButtonComponent } from '../../shared/components/gold-button/gold-button.component';
import { EditableFieldComponent } from '../../shared/components/editable-field/editable-field.component';
import { BackgroundGridComponent } from '../../shared/components/background-grid/background-grid.component';

@Component({
  selector: 'app-signup',
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
    <div class="relative min-h-screen bg-arch-bg flex items-center justify-center overflow-hidden">
      <app-background-grid [opacity]="0.18" />

      <!-- Radial glow -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96
                  bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative w-full max-w-sm mx-auto px-6 py-12 animate-fade-up">

        <!-- Brand -->
        <div class="text-center mb-10">
          <p class="font-display text-4xl font-semibold text-gold tracking-widest mb-1">ARCH<span class="text-white/30">AI</span></p>
          <h1 class="font-display text-2xl font-semibold text-white mt-3">Create Your Account</h1>
          <p class="text-arch-muted text-sm mt-1">Join us today</p>
        </div>

        <!-- Card -->
        <div class="arch-card p-6 space-y-4">

          <!-- First + Last name row -->
          <div class="grid grid-cols-2 gap-3">
            <app-editable-field
              label="First Name"
              placeholder="John"
              [(ngModel)]="firstName"
              [errorMessage]="submitted && !firstName.trim() ? 'Required' : ''"
            />
            <app-editable-field
              label="Last Name"
              placeholder="Doe"
              [(ngModel)]="lastName"
              [errorMessage]="submitted && !lastName.trim() ? 'Required' : ''"
            />
          </div>

          <!-- Email -->
          <app-editable-field
            label="Email"
            placeholder="you@example.com"
            [(ngModel)]="email"
            [errorMessage]="submitted && !isEmailValid ? 'Enter a valid email' : ''"
          />

          <!-- Password -->
          <app-editable-field
            label="Password"
            placeholder="••••••••"
            [isPassword]="true"
            [(ngModel)]="password"
            [errorMessage]="submitted && !isPasswordValid ? 'Min 6 characters' : ''"
          />

          <!-- Sign up button -->
          <div [class.opacity-40]="!isFormValid" [class.pointer-events-none]="!isFormValid">
            <app-gold-button
              text="Sign Up"
              [loading]="loading()"
              (clicked)="handleSignUp()"
            />
          </div>

          <!-- Password strength hint -->
          <div *ngIf="password.length > 0" class="flex gap-1 pt-1">
            <div *ngFor="let i of [1,2,3,4]"
              class="h-1 flex-1 rounded-full transition-all duration-300"
              [ngClass]="getStrengthClass(i)">
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="divider-text my-6">or continue with</div>

        <!-- Social buttons -->
        <div class="space-y-3">
          <button type="button"
            class="btn-social bg-white text-black hover:bg-white/90"
            (click)="handleGoogleSignUp()">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button type="button" class="btn-social bg-black text-white border-white/10 hover:bg-white/5">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        <!-- Login link -->
        <p class="text-center text-arch-muted text-sm mt-8">
          Already have an account?&nbsp;
          <a routerLink="/login" class="text-gold font-semibold hover:underline">Log In</a>
        </p>

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
      </div>
    </div>
  `,
})
export class SignupComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  submitted = false;

  loading = signal(false);
  errorMsg = signal('');

  get isEmailValid(): boolean { return Validators.isValidEmail(this.email); }
  get isPasswordValid(): boolean { return Validators.isValidPassword(this.password); }
  get isFormValid(): boolean {
    return this.firstName.trim().length > 0 &&
           this.lastName.trim().length > 0 &&
           this.isEmailValid &&
           this.isPasswordValid;
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {}

  getStrengthClass(index: number): string {
    const len = this.password.length;
    const strength = len >= 12 ? 4 : len >= 8 ? 3 : len >= 6 ? 2 : 1;
    const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
    return index <= strength ? colors[strength - 1] : 'bg-arch-border';
  }

  async handleSignUp(): Promise<void> {
    this.submitted = true;
    if (!this.isFormValid) return;

    this.loading.set(true);
    this.errorMsg.set('');

    try {
      const credential = await this.authService.signUpWithEmail(this.email, this.password);

      await this.userService.saveUserData({
        uid: credential.user.uid,
        firstName: this.firstName.trim(),
        lastName: this.lastName.trim(),
        email: this.email.trim(),
      });

      this.router.navigateByUrl('/home');
    } catch {
      this.errorMsg.set('Error signing up. Please try again.');
      setTimeout(() => this.errorMsg.set(''), 4000);
    } finally {
      this.loading.set(false);
    }
  }

  async handleGoogleSignUp(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.authService.signInWithGoogle();
      const user = result.user;

      await this.userService.saveUserData({
        uid: user.uid,
        firstName: user.displayName?.split(' ')[0] ?? 'User',
        lastName: user.displayName?.split(' ').slice(1).join(' ') ?? '',
        email: user.email ?? '',
      });

      this.router.navigateByUrl('/home');
    } catch {
      this.errorMsg.set('Google sign-up failed. Please try again.');
      setTimeout(() => this.errorMsg.set(''), 4000);
    } finally {
      this.loading.set(false);
    }
  }
}
