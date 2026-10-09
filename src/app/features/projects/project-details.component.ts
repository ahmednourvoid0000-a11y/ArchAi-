import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectDoc } from '../../core/services/firestore.service';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-3.5">
      <div class="w-[42px] h-[42px] rounded-[14px] bg-gold/[0.12]
                  flex items-center justify-center shrink-0">
        <svg *ngIf="icon === 'edit'" class="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
        </svg>
        <svg *ngIf="icon === 'sparkle'" class="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
        </svg>
      </div>
      <span class="text-gold text-[22px] font-bold">{{ title }}</span>
    </div>
  `,
})
export class SectionTitleComponent {
  @Input() title = '';
  @Input() icon: 'edit' | 'sparkle' = 'sparkle';
}

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule, SectionTitleComponent],
  template: `
    <div class="min-h-screen bg-[#0E0E0E] overflow-hidden">
      <header class="flex items-center justify-center relative px-5 py-4
                     border-b border-white/[0.06] bg-[#0E0E0E]/80 backdrop-blur-sm">
        <button type="button" (click)="goBack()"
          class="absolute left-4 w-9 h-9 flex items-center justify-center rounded-xl
                 text-arch-muted hover:text-white hover:bg-arch-surface transition-all">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="font-display text-lg font-bold text-gold">Project Details</h1>
      </header>

      <main class="max-w-lg mx-auto px-5 py-6 space-y-8 pb-16">

        <!-- Header card -->
        <div class="w-full rounded-[28px] p-6 border border-gold/25
                    bg-gradient-to-br from-gold/[0.16] to-[#1C1C1C]
                    shadow-[0_0_24px_rgba(201,168,76,0.08)]
                    flex flex-col items-center text-center gap-4 animate-fade-up">
          <div class="w-[72px] h-[72px] rounded-full flex items-center justify-center
                      bg-gradient-to-br from-gold to-gold/70 shadow-lg shadow-gold/20">
            <svg class="w-9 h-9 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21"/>
            </svg>
          </div>
          <p class="text-white text-2xl font-extrabold">AI Generated Design</p>
          <p class="text-white/65 text-sm leading-relaxed max-w-xs">
            Detailed architectural output generated using AI assistance.
          </p>
        </div>

        <!-- User Prompt -->
        <section>
          <app-section-title title="User Prompt" icon="edit" />
          <div class="mt-4 w-full p-[18px] rounded-[22px] bg-[#1C1C1C] border border-gold/[0.15]">
            <p class="text-white text-[15px] leading-[1.7]">
              {{ project()?.prompt || 'No prompt found.' }}
            </p>
          </div>
        </section>

        <!-- AI Result -->
        <section>
          <app-section-title title="AI Result" icon="sparkle" />
          <div class="mt-4">
            <ng-container *ngIf="hasImage(); else textResult">
              <div class="rounded-[28px] border-2 border-gold/25 overflow-hidden
                          shadow-[0_0_25px_rgba(201,168,76,0.12)]">
                <img [src]="imageSrc()" alt="AI architectural design"
                  class="w-full object-cover"
                  [class.opacity-0]="!imgLoaded()"
                  [class.opacity-100]="imgLoaded()"
                  style="transition: opacity 400ms ease"
                  (load)="imgLoaded.set(true)" />
                <div *ngIf="!imgLoaded()"
                  class="w-full aspect-square bg-[#1C1C1C] flex items-center justify-center">
                  <div class="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                </div>
              </div>
            </ng-container>
            <ng-template #textResult>
              <div class="w-full p-[18px] rounded-[22px] bg-[#1C1C1C] border border-gold/[0.15]">
                <p class="text-white text-[15px] leading-[1.7]">
                  {{ project()?.result || 'No AI result found.' }}
                </p>
              </div>
            </ng-template>
          </div>
        </section>
      </main>
    </div>
  `,
})
export class ProjectDetailsComponent implements OnInit {
  project   = signal<ProjectDoc | null>(null);
  hasImage  = signal(false);
  imageSrc  = signal('');
  imgLoaded = signal(false);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const nav   = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { project: ProjectDoc } | undefined;
    if (state?.project) {
      this.setProject(state.project);
    } else {
      const histState = history.state as { project?: ProjectDoc };
      if (histState?.project) this.setProject(histState.project);
    }
  }

  private setProject(p: ProjectDoc): void {
    this.project.set(p);
    const result = p.result ?? '';
    if (this.isBase64(result)) {
      this.hasImage.set(true);
      const mime = result.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
      const raw  = result.includes(',') ? result.split(',').at(-1)! : result;
      this.imageSrc.set(`data:${mime};base64,${raw}`);
    }
  }

  isBase64(value: string): boolean {
    if (!value) return false;
    return (
      value.startsWith('data:image') ||
      value.startsWith('/9j/')       ||
      value.startsWith('iVBOR')      ||
      value.startsWith('UklGR')      ||
      value.length > 1000
    );
  }

  goBack(): void { this.router.navigateByUrl('/projects'); }
}
