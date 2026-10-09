import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

/**
 * EditableField – Angular standalone component.
 * Mirrors the Flutter EditableField widget.
 * Implements ControlValueAccessor so it works with both
 * template-driven [(ngModel)] and reactive forms [formControl].
 */
@Component({
  selector: 'app-editable-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableFieldComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1.5">
      <label class="arch-label">{{ label }}</label>

      <div class="relative">
        <!-- Optional prefix icon -->
        <span
          *ngIf="prefixIcon"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-arch-muted"
        >
          <ng-content select="[prefix]"></ng-content>
        </span>

        <input
          [type]="isPassword ? (showPassword ? 'text' : 'password') : 'text'"
          [value]="value"
          [disabled]="disabled"
          [placeholder]="placeholder"
          [ngClass]="[
            'arch-input',
            prefixIcon ? 'pl-10' : '',
            isPassword ? 'pr-10' : '',
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          ]"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />

        <!-- Password toggle -->
        <button
          *ngIf="isPassword"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-arch-muted hover:text-white transition-colors"
          (click)="showPassword = !showPassword"
        >
          <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        </button>
      </div>

      <!-- Validation error message -->
      <p *ngIf="errorMessage" class="text-red-400 text-xs mt-0.5">
        {{ errorMessage }}
      </p>
    </div>
  `,
})
export class EditableFieldComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() isPassword = false;
  @Input() prefixIcon = false;
  @Input() errorMessage = '';

  value = '';
  disabled = false;
  showPassword = false;

  onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }

  writeValue(v: string): void {
    this.value = v ?? '';
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
