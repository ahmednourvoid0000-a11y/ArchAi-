import { Component } from '@angular/core';

/**
 * BotPreviewComponent – Angular standalone rewrite of Flutter's BotPreview widget.
 * Displayed inside the chat list when a message has `isPreview: true`.
 */
@Component({
  selector: 'app-bot-preview',
  standalone: true,
  template: `
    <div class="flex justify-start my-2">
      <div class="flex flex-col items-center justify-center gap-2
                  w-full max-w-xs h-[120px] rounded-2xl
                  bg-arch-surface border border-gold/50
                  text-center px-4 select-none">

        <!-- Robot icon -->
        <div class="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
          <svg class="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.75 3.75h4.5M12 3.75V6m-6 2.25h12a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5v-7.5A1.5 1.5 0 016 8.25zM9 12.75h.008v.008H9v-.008zm3 0h.008v.008H12v-.008zm3 0h.008v.008H15v-.008z"/>
          </svg>
        </div>

        <span class="text-white/60 text-xs font-medium">Bot Preview</span>
      </div>
    </div>
  `,
})
export class BotPreviewComponent {}
