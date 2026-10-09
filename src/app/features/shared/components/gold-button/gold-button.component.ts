import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * GoldButtonComponent – exact port of Flutter's GoldButton widget.
 *
 * Dart source features:
 *  - Filled: height:60, gradient topLeft(#FFE29D)→bottomRight(#FFD166), radius:18
 *            shadow 0 3px 6px black/20%, AnimatedScale 120ms on press
 *  - Outlined: height:56, border gold 1.2px, no fill, same press animation
 *  - [loading] spinner: added in Angular for async operations
 */
@Component({
  selector: 'app-gold-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- FILLED variant -->
    <button *ngIf="!outlined"
      type="button"
      [disabled]="disabled || loading"
      (mousedown)="pressed.set(true)"
      (mouseup)="pressed.set(false)"
      (mouseleave)="pressed.set(false)"
      (touchstart)="pressed.set(true)"
      (touchend)="pressed.set(false)"
      (click)="clicked.emit()"
      class="w-full h-[60px] flex items-center justify-center gap-2
             rounded-[18px] font-bold text-black text-base
             bg-gradient-to-br from-[#FFE29D] to-[#FFD166]
             transition-all duration-[120ms] ease-out
             disabled:opacity-40 disabled:cursor-not-allowed"
      [style.transform]="pressed() ? 'scale(0.98)' : 'scale(1)'"
      [style.box-shadow]="pressed() ? 'none' : '0 3px 6px rgba(0,0,0,0.20)'"
    >
      <span *ngIf="loading" class="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
      {{ text }}
    </button>

    <!-- OUTLINED variant -->
    <button *ngIf="outlined"
      type="button"
      [disabled]="disabled || loading"
      (mousedown)="pressed.set(true)"
      (mouseup)="pressed.set(false)"
      (mouseleave)="pressed.set(false)"
      (touchstart)="pressed.set(true)"
      (touchend)="pressed.set(false)"
      (click)="clicked.emit()"
      class="w-full h-[56px] flex items-center justify-center gap-2
             rounded-[18px] font-semibold text-[#FFD166] text-base
             border border-[#FFD166] bg-transparent
             transition-all duration-[120ms] ease-out
             disabled:opacity-40 disabled:cursor-not-allowed"
      [style.transform]="pressed() ? 'scale(0.98)' : 'scale(1)'"
      [style.box-shadow]="pressed() ? 'none' : '0 2px 4px rgba(0,0,0,0.10)'"
    >
      <span *ngIf="loading" class="w-4 h-4 border-2 border-[#FFD166]/40 border-t-[#FFD166] rounded-full animate-spin"></span>
      {{ text }}
    </button>
  `,
})
export class GoldButtonComponent {
  @Input() text = '';
  @Input() outlined = false;
  @Input() disabled = false;
  @Input() loading = false;
  @Output() clicked = new EventEmitter<void>();

  pressed = signal(false);
}
