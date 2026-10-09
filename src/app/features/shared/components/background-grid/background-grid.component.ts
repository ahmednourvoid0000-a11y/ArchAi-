import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * BackgroundGridComponent – Angular rewrite of Flutter's BackgroundGrid widget.
 *
 * Dart source: BackgroundGrid({opacity:0.2, gridSize:40, triangleSize:80})
 *
 * Reproduces:
 *  - Gold grid lines every 40 px at 30% opacity  (#D4AF37)
 *  - Repeating triangle pattern overlay at 80 px grid  (stroke 20% opacity)
 *  - Overall opacity controlled by [opacity] input
 *
 * Implemented with a single SVG <pattern> so no canvas needed.
 */
@Component({
  selector: 'app-background-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="absolute inset-0 pointer-events-none overflow-hidden"
      [style.opacity]="opacity"
    >
      <svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Grid lines every 40 px -->
          <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none"
              stroke="#D4AF37" stroke-width="0.5" stroke-opacity="0.30"/>
          </pattern>

          <!-- Triangle overlay every 80 px (triangleSize:80)
               Dart: cx = x+40, top=(cx, y+10), left=(x+20,y+50), right=(x+60,y+50) -->
          <pattern id="archTri" width="80" height="80" patternUnits="userSpaceOnUse">
            <polygon points="40,10 60,50 20,50" fill="none"
              stroke="#D4AF37" stroke-width="0.5" stroke-opacity="0.20"/>
          </pattern>
        </defs>

        <!-- Grid fill -->
        <rect width="100%" height="100%" fill="url(#archGrid)"/>
        <!-- Triangle overlay -->
        <rect width="100%" height="100%" fill="url(#archTri)"/>
      </svg>
    </div>
  `,
})
export class BackgroundGridComponent {
  @Input() opacity = 0.2;
  @Input() gridSize = 40;      // kept for API parity
  @Input() triangleSize = 80;  // kept for API parity
}
