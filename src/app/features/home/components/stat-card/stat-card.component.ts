import { Component, Input } from '@angular/core';

/**
 * StatCardComponent – reusable stat display.
 * Mirrors Flutter's _buildStatCard helper inside HomeScreen.
 */
@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="flex-1 flex flex-col items-center gap-3 p-[18px] rounded-3xl
                bg-white/[0.04] border border-gold/[0.18]">
      <ng-content select="[icon]" />
      <p class="text-white text-2xl font-black leading-none">{{ value }}</p>
      <p class="text-white/70 text-[13px]">{{ label }}</p>
    </div>
  `,
})
export class StatCardComponent {
  @Input() value = '';
  @Input() label = '';
}
