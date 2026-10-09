import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * PlanPreviewBubbleComponent – Angular standalone rewrite of Flutter's PlanPreviewBubble.
 *
 * Flutter used an AnimationController with a 350 ms delay then a 500 ms fade-in.
 * We replicate this with a CSS opacity transition triggered after mount.
 */
@Component({
  selector: 'app-plan-preview-bubble',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-start px-1 py-2">
      <div
        class="w-full max-w-sm rounded-2xl border-2 border-gold overflow-hidden
               bg-gradient-to-br from-arch-surface to-[#0D0D0D]
               transition-opacity duration-500"
        [style.opacity]="visible ? '1' : '0'"
      >
        <!-- Inner card -->
        <div class="p-3 flex flex-col gap-2" style="height: 200px;">

          <!-- Preview area -->
          <div class="flex-1 rounded-xl border border-gold/30 bg-[#0D0D0D]
                      flex flex-col items-center justify-center gap-2">

            <!-- Sparkle icon -->
            <div class="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
              </svg>
            </div>

            <span class="text-white/60 text-xs font-medium">2D Floor Plan Preview</span>
          </div>

          <!-- Caption -->
          <p class="text-gold text-xs font-medium text-center leading-snug">
            Your floor plan has been generated!
          </p>

          <!-- Save button -->
          <button
            type="button"
            (click)="onSave()"
            class="mx-auto w-44 h-10 rounded-xl font-bold text-sm text-black
                   bg-gradient-to-r from-gold-light to-gold
                   shadow-md shadow-gold/25
                   hover:opacity-90 active:scale-95 transition-all"
          >
            Save the Design
          </button>
        </div>
      </div>
    </div>
  `,
})
export class PlanPreviewBubbleComponent implements OnInit {
  @Output() save = new EventEmitter<void>();

  visible = false;

  ngOnInit(): void {
    // Mirror Flutter's 350 ms delay before fade-in starts
    setTimeout(() => (this.visible = true), 350);
  }

  onSave(): void {
    this.save.emit();
  }
}
