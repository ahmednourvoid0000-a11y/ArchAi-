import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ImageBubbleComponent – renders a base64 AI-generated image in the chat.
 * Mirrors the Flutter Image.memory(base64Decode(msg.text)) rendering.
 *
 * Shows a shimmer skeleton while the image is loading,
 * then fades in the actual image with a smooth transition.
 */
@Component({
  selector: 'app-image-bubble',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-start my-2 animate-fade-up">
      <div class="max-w-xs w-full rounded-2xl overflow-hidden border border-gold/30
                  shadow-lg shadow-gold/10">

        <!-- Shimmer skeleton (shown while loading) -->
        <div
          *ngIf="!loaded()"
          class="w-full aspect-square bg-arch-surface relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-transparent
                      via-white/5 to-transparent animate-shimmer
                      bg-[length:200%_100%]"></div>
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <svg class="w-8 h-8 text-gold/40 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M4.5 3v18M19.5 3v18"/>
            </svg>
            <span class="text-arch-muted text-xs">Rendering design…</span>
          </div>
        </div>

        <!-- Generated image -->
        <img
          *ngIf="imageSrc"
          [src]="imageSrc"
          alt="AI-generated architectural design"
          class="w-full object-cover transition-opacity duration-500 rounded-2xl"
          [class.opacity-0]="!loaded()"
          [class.opacity-100]="loaded()"
          (load)="loaded.set(true)"
        />

        <!-- Caption bar -->
        <div *ngIf="loaded()"
          class="px-3 py-2 bg-arch-surface/80 backdrop-blur-sm
                 border-t border-arch-border flex items-center gap-2">
          <svg class="w-3.5 h-3.5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-xs text-arch-muted">AI architectural design generated</span>
        </div>
      </div>
    </div>
  `,
})
export class ImageBubbleComponent implements OnInit {
  /** Raw base64 string (no data-URI prefix) */
  @Input() base64 = '';

  imageSrc = '';
  loaded = signal(false);

  ngOnInit(): void {
    if (this.base64) {
      // Detect image type from base64 header
      const mime = this.base64.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
      this.imageSrc = `data:${mime};base64,${this.base64}`;
    }
  }
}
