import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ActionCardComponent – Angular standalone rewrite of Flutter's ActionCard widget.
 *
 * Dark gradient card with a gold icon badge, title, subtitle, and tap handler.
 * Adds a subtle press/hover scale effect via Tailwind's group utilities.
 */
@Component({
  selector: 'app-action-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="tapped.emit()"
      class="group w-full text-left
             bg-gradient-to-br from-arch-surface to-[#0D0D0D]
             border-2 border-gold/30 rounded-[18px] p-5
             shadow-sm shadow-black/10
             hover:border-gold/60 hover:shadow-gold/10 hover:shadow-md
             active:scale-[0.98]
             transition-all duration-200 ease-out"
    >
      <div class="flex items-center gap-4">

        <!-- Icon badge -->
        <div class="w-12 h-12 rounded-[14px] bg-gold/10 flex items-center justify-center
                    shrink-0 group-hover:bg-gold/20 transition-colors duration-200">
          <ng-content select="[icon]" />
        </div>

        <!-- Text -->
        <div class="flex-1 min-w-0">
          <p class="text-white font-bold text-base leading-tight truncate">{{ title }}</p>
          <p class="text-white/60 text-sm mt-1 leading-snug">{{ subtitle }}</p>
        </div>

        <!-- Chevron -->
        <svg class="w-4 h-4 text-gold/40 shrink-0 group-hover:text-gold/80 group-hover:translate-x-0.5
                    transition-all duration-200"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </button>
  `,
})
export class ActionCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Output() tapped = new EventEmitter<void>();
}
