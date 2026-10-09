import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ArchLogoComponent – faithful SVG port of Flutter's _CompassAPainter.
 *
 * The Flutter painter draws a drafting compass (dividers) with:
 *  - Left leg: (40,95) → (60,25)
 *  - Right leg: (80,95) → (60,25)
 *  - Crossbar at y=65: x 47→73
 *  - Pivot ring at (60,25): outer r=8, inner fill r=3
 *  - Two feet circles at (40,95) and (80,95) r=5
 *  - Dashed quadratic arc from (45,85) through (60,80) to (75,85)
 *  - Gold gradient: #FFD700 → #D4AF37 → #FFD700
 *  All coords normalised from a 120×120 viewport.
 *
 * Optional [showText] adds the gradient "ArchAi" label below.
 */
@Component({
  selector: 'app-arch-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center" [style.width.px]="size">

      <!-- Compass SVG – exact port of _CompassAPainter -->
      <svg
        [attr.width]="size"
        [attr.height]="size"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stop-color="#FFD700"/>
            <stop offset="50%"  stop-color="#D4AF37"/>
            <stop offset="100%" stop-color="#FFD700"/>
          </linearGradient>
        </defs>

        <!-- Left leg -->
        <line x1="40" y1="95" x2="60" y2="25"
          stroke="url(#goldGrad)" stroke-width="4.9" stroke-linecap="round"/>

        <!-- Right leg -->
        <line x1="80" y1="95" x2="60" y2="25"
          stroke="url(#goldGrad)" stroke-width="4.9" stroke-linecap="round"/>

        <!-- Crossbar -->
        <line x1="47" y1="65" x2="73" y2="65"
          stroke="url(#goldGrad)" stroke-width="4.5" stroke-linecap="round"/>

        <!-- Pivot outer ring (fill bg first, then stroke) -->
        <circle cx="60" cy="25" r="8" fill="#0D0D0D"/>
        <circle cx="60" cy="25" r="8" stroke="url(#goldGrad)" stroke-width="3"/>

        <!-- Pivot inner filled dot -->
        <circle cx="60" cy="25" r="3" fill="url(#goldGrad)"/>

        <!-- Left foot -->
        <circle cx="40" cy="95" r="5" fill="url(#goldGrad)"/>

        <!-- Right foot -->
        <circle cx="80" cy="95" r="5" fill="url(#goldGrad)"/>

        <!-- Dashed arc: quadratic (45,85) ctrl(60,80) (75,85)
             Approximated with 5 short strokes along the curve   -->
        <path d="M45,85 Q60,80 75,85"
          stroke="url(#goldGrad)" stroke-width="1.5" stroke-linecap="round"
          stroke-dasharray="6 6" fill="none" opacity="0.7"/>
      </svg>

      <!-- Optional text with gold gradient (showText=true) -->
      <p *ngIf="showText"
        class="mt-2 font-display font-semibold text-transparent bg-clip-text text-center"
        style="background-image: linear-gradient(to right, #FFD700, #D4AF37, #FFD700);
               -webkit-background-clip: text;"
        [style.font-size.px]="size * 0.27"
      >
        ArchAi
      </p>
    </div>
  `,
})
export class ArchLogoComponent {
  @Input() size = 120;
  @Input() showText = false;
}
