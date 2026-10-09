import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { BackgroundGridComponent } from '../shared/components/background-grid/background-grid.component';

/**
 * SettingsScreenComponent – Angular standalone rewrite of Flutter's SettingsScreen.
 *
 * Features:
 *  - Collapsible "Report a Bug" section with AnimatedSize equivalent
 *    (CSS max-height transition – identical 250 ms ease-in-out timing)
 *  - Gold send button enabled only when textarea has content
 *  - Log Out tile
 */
@Component({
  selector: 'app-settings-screen',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BackgroundGridComponent],
  template: `
    <div class="relative min-h-screen bg-arch-bg overflow-hidden">
      <app-background-grid [opacity]="0.16" />

      <!-- Header -->
      <header class="relative z-10 flex items-center gap-3 px-5 py-4
                     border-b border-arch-border bg-arch-bg/80 backdrop-blur-sm">
        <a routerLink="/home"
          class="flex items-center gap-1.5 text-arch-muted hover:text-white transition-colors text-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </a>
        <h1 class="font-display text-xl font-semibold text-white">Settings</h1>
      </header>

      <!-- Body -->
      <main class="relative z-10 max-w-lg mx-auto px-4 py-5 space-y-6">

        <!-- ── Report a Bug card ── -->
        <div class="settings-card">

          <!-- Toggle row -->
          <button
            type="button"
            (click)="showBugReport.set(!showBugReport())"
            class="w-full flex items-center gap-3 text-left
                   hover:bg-white/[0.02] rounded-xl px-1 py-1
                   transition-colors duration-150"
          >
            <!-- Icon badge -->
            <div class="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44a23.916 23.916 0 001.152 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.778 3.778 0 01.4-2.25m0 0a5.002 5.002 0 019.45 0m-9.45 0A5.002 5.002 0 002.55 5.764"/>
              </svg>
            </div>

            <!-- Text -->
            <div class="flex-1 min-w-0">
              <p class="text-white font-semibold text-sm">Report a Bug</p>
              <p class="text-arch-muted text-xs mt-0.5">Help us improve the app</p>
            </div>

            <!-- Chevron – rotates when open (mirrors Flutter's up/down icon swap) -->
            <svg
              class="w-5 h-5 text-white/50 shrink-0 transition-transform duration-250"
              [class.rotate-180]="showBugReport()"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <!-- Collapsible section – mirrors Flutter's AnimatedSize 250 ms ease-in-out -->
          <div
            class="overflow-hidden transition-all duration-[250ms] ease-in-out"
            [style.max-height]="showBugReport() ? '320px' : '0px'"
            [style.opacity]="showBugReport() ? '1' : '0'"
          >
            <div class="pt-4 space-y-3">
              <!-- Textarea -->
              <textarea
                [(ngModel)]="bugText"
                rows="4"
                placeholder="Describe the issue you're experiencing…"
                class="arch-input w-full resize-none leading-relaxed text-sm"
              ></textarea>

              <!-- Send button – right-aligned, gold when has text -->
              <div class="flex justify-end">
                <button
                  type="button"
                  [disabled]="!bugText.trim()"
                  (click)="submitBugReport()"
                  class="w-11 h-11 rounded-xl flex items-center justify-center
                         transition-all duration-200 active:scale-90
                         disabled:opacity-30 disabled:cursor-not-allowed"
                  [ngClass]="bugText.trim()
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] shadow-md shadow-gold/20'
                    : 'bg-[#4A4A4A]'"
                >
                  <svg
                    class="w-5 h-5"
                    [class.text-black]="bugText.trim()"
                    [class.text-gray-400]="!bugText.trim()"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── App Info ── -->
        <div class="settings-card space-y-1">
          <p class="text-xs uppercase tracking-widest text-arch-muted font-medium px-1 pb-2">
            About
          </p>

          <div class="settings-row">
            <span class="text-white/60 text-sm">Version</span>
            <span class="text-arch-muted text-sm">1.0.0</span>
          </div>

          <div class="h-px bg-arch-border mx-1"></div>

          <div class="settings-row">
            <span class="text-white/60 text-sm">Platform</span>
            <span class="text-arch-muted text-sm">Web (Angular)</span>
          </div>

          <div class="h-px bg-arch-border mx-1"></div>

          <div class="settings-row">
            <span class="text-white/60 text-sm">Powered by</span>
            <span class="text-gold text-sm font-medium">ArchAI</span>
          </div>
        </div>

        <!-- ── Log Out ── -->
        <div class="settings-card">
          <button
            type="button"
            (click)="logout()"
            class="w-full flex items-center gap-3 px-1 py-1
                   hover:bg-red-500/5 rounded-xl transition-colors duration-150
                   group"
          >
            <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0
                        group-hover:bg-red-500/20 transition-colors">
              <svg class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="text-red-400 font-semibold text-sm">Log Out</p>
              <p class="text-arch-muted text-xs mt-0.5">Sign out of your account</p>
            </div>
          </button>
        </div>

      </main>

      <!-- Success toast -->
      <div *ngIf="toastMsg()"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50
               flex items-center gap-2 bg-green-500/10 border border-green-500/30
               rounded-xl px-5 py-3 text-green-400 text-sm shadow-xl animate-fade-up
               whitespace-nowrap">
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ toastMsg() }}
      </div>
    </div>
  `,
  styles: [`
    .settings-card {
      @apply bg-[#141414] border border-white/[0.07] rounded-2xl p-3;
    }
    .settings-row {
      @apply flex items-center justify-between px-1 py-2.5;
    }
  `],
})
export class SettingsScreenComponent {
  showBugReport = signal(false);
  bugText = '';
  toastMsg = signal('');

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {}

  submitBugReport(): void {
    if (!this.bugText.trim()) return;
    // In production: send to a Firestore collection or email API
    console.log('Bug report submitted:', this.bugText);
    this.bugText = '';
    this.showBugReport.set(false);
    this.showToast('Bug report submitted! Thank you.');
  }

  async logout(): Promise<void> {
    await this.authService.signOut();
    this.userService.clearUserData();
    this.router.navigateByUrl('/login');
  }

  private showToast(msg: string): void {
    this.toastMsg.set(msg);
    setTimeout(() => this.toastMsg.set(''), 3500);
  }
}
