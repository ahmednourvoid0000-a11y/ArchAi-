import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * InputBarComponent – Angular standalone rewrite of Flutter's InputBar widget.
 * Auto-grows as the user types, sends on Enter (Shift+Enter = new line).
 */
@Component({
  selector: 'app-input-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="border-t border-arch-border bg-arch-bg/90 backdrop-blur-sm px-4 py-3">
      <div class="flex items-end gap-3 max-w-3xl mx-auto">

        <!-- Textarea -->
        <div class="flex-1 relative">
          <textarea
            #textareaRef
            [(ngModel)]="value"
            [placeholder]="hintText"
            [disabled]="disabled"
            rows="1"
            class="arch-input resize-none pr-4 leading-relaxed
                   overflow-hidden min-h-[46px] max-h-[140px]"
            (input)="onInput()"
            (keydown.enter)="onEnter($event)"
          ></textarea>
        </div>

        <!-- Send button -->
        <button
          type="button"
          [disabled]="!canSend || loading"
          (click)="onSend()"
          class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                 transition-all duration-200 active:scale-90
                 disabled:opacity-30 disabled:cursor-not-allowed"
          [ngClass]="canSend && !loading
            ? 'bg-gradient-to-br from-gold-light to-gold shadow-md shadow-gold/20 hover:opacity-90'
            : 'bg-arch-surface border border-arch-border'"
        >
          <!-- Loading spinner -->
          <span *ngIf="loading"
            class="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin">
          </span>

          <!-- Send arrow -->
          <svg *ngIf="!loading"
            class="w-5 h-5"
            [class.text-black]="canSend"
            [class.text-arch-muted]="!canSend"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5"/>
          </svg>
        </button>
      </div>
    </div>
  `,
})
export class InputBarComponent implements AfterViewInit {
  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;

  @Input() hintText = 'Type a message…';
  @Input() disabled = false;
  @Input() loading = false;

  @Output() send = new EventEmitter<string>();

  value = '';

  get canSend(): boolean {
    return this.value.trim().length > 0 && !this.disabled && !this.loading;
  }

  ngAfterViewInit(): void {
    this.autoResize();
  }

  onInput(): void {
    this.autoResize();
  }

  onEnter(event: Event): void {
    const ke = event as KeyboardEvent;
    if (ke.shiftKey) return; // Shift+Enter → new line
    ke.preventDefault();
    this.onSend();
  }

  onSend(): void {
    if (!this.canSend) return;
    const text = this.value.trim();
    this.value = '';
    this.autoResize();
    this.send.emit(text);
  }

  private autoResize(): void {
    const el = this.textareaRef?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }
}
