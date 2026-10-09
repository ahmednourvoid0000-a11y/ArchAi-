import {
  Component,
  Input,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * AnimatedActionCardComponent – Angular standalone rewrite of Flutter's AnimatedActionCard.
 *
 * Flutter used TweenAnimationBuilder<double> with a FutureBuilder delay to stagger
 * a fade-in + slide-from-left animation.
 *
 * Angular equivalent:
 *  - CSS transition on opacity + transform
 *  - A setTimeout matching delayMs triggers the "show" state
 *  - 400 ms ease-out duration mirrors the Flutter tween duration
 */
@Component({
  selector: 'app-animated-action-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="transition-all duration-[400ms] ease-out"
      [style.opacity]="visible() ? '1' : '0'"
      [style.transform]="visible() ? 'translateX(0)' : 'translateX(-20px)'"
    >
      <ng-content />
    </div>
  `,
})
export class AnimatedActionCardComponent implements OnInit {
  /** Delay in ms before the card slides in – mirrors Flutter's delayMs param */
  @Input() delayMs = 0;

  visible = signal(false);

  ngOnInit(): void {
    if (this.delayMs === 0) {
      this.visible.set(true);
    } else {
      setTimeout(() => this.visible.set(true), this.delayMs);
    }
  }
}
