import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * MessageBubbleComponent – renders a single chat message bubble.
 * User messages: gold gradient, right-aligned.
 * AI messages: dark surface, left-aligned with a subtle bot icon.
 */
@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex my-1.5 animate-fade-up"
      [class.justify-end]="isUser"
      [class.justify-start]="!isUser"
    >
      <!-- Bot avatar (only for AI messages) -->
      <div *ngIf="!isUser"
        class="w-7 h-7 rounded-full bg-gold/10 border border-gold/20 flex items-center
               justify-center mr-2 mt-1 shrink-0">
        <svg class="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9.75 3.75h4.5M12 3.75V6m-6 2.25h12a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5v-7.5A1.5 1.5 0 016 8.25z"/>
        </svg>
      </div>

      <!-- Bubble -->
      <div
        class="max-w-[75%] sm:max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed"
        [ngClass]="isUser
          ? 'bg-gradient-to-br from-gold-light via-gold to-gold-dark text-black rounded-br-sm font-medium'
          : 'bg-arch-surface border border-arch-border text-white rounded-bl-sm'"
      >
        <!-- Markdown-style line breaks -->
        <span [innerHTML]="formattedText"></span>
      </div>
    </div>
  `,
})
export class MessageBubbleComponent {
  @Input() text = '';
  @Input() isUser = false;

  get formattedText(): string {
    // Convert newlines to <br> for multi-line AI responses
    return this.text.replace(/\n/g, '<br>');
  }
}
