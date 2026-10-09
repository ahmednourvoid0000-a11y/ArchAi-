import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen bg-arch-bg flex flex-col items-center justify-center gap-6 px-6">
      <!-- Brand -->
      <p class="font-display text-5xl font-semibold text-gold tracking-widest">
        ARCH<span class="text-white/30">AI</span>
      </p>
      <p class="text-arch-muted text-sm mb-2">Choose a feature to get started</p>

      <!-- Feature cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm">

        <!-- Create Project (Chat) -->
        <a routerLink="/chat"
          class="group arch-card p-5 flex flex-col gap-3 hover:border-gold/50 transition-all duration-200 cursor-pointer">
          <div class="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center
                      group-hover:bg-gold/20 transition-colors">
            <svg class="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18"/>
            </svg>
          </div>
          <div>
            <p class="text-white font-semibold text-sm">Create Project</p>
            <p class="text-arch-muted text-xs mt-0.5">AI architectural design from your description</p>
          </div>
        </a>

        <!-- AI Bot -->
        <a routerLink="/bot"
          class="group arch-card p-5 flex flex-col gap-3 hover:border-gold/50 transition-all duration-200 cursor-pointer">
          <div class="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center
                      group-hover:bg-gold/20 transition-colors">
            <svg class="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9.75 3.75h4.5M12 3.75V6m-6 2.25h12a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5v-7.5A1.5 1.5 0 016 8.25z"/>
            </svg>
          </div>
          <div>
            <p class="text-white font-semibold text-sm">AI Bot</p>
            <p class="text-arch-muted text-xs mt-0.5">Chat with your AI architecture assistant</p>
          </div>
        </a>

        <!-- Profile -->
        <a routerLink="/profile"
          class="group arch-card p-5 flex flex-col gap-3 hover:border-gold/50 transition-all duration-200 cursor-pointer sm:col-span-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center
                        group-hover:bg-gold/20 transition-colors">
              <svg class="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
            </div>
            <div>
              <p class="text-white font-semibold text-sm">Your Profile</p>
              <p class="text-arch-muted text-xs mt-0.5">Manage your account settings</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  `,
})
export class HomeComponent {}
