import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { FirestoreService, ProjectDoc } from '../../core/services/firestore.service';
import { BackgroundGridComponent } from '../shared/components/background-grid/background-grid.component';
import { BottomNavComponent } from '../home/components/bottom-nav/bottom-nav.component';

/**
 * ProjectsScreenComponent – Angular standalone rewrite of Flutter's ProjectsScreen.
 *
 * Features:
 *  - Loads projects from Firestore on init
 *  - Card list with base64 image previews (mirrors Flutter Image.memory)
 *  - Delete with confirmation dialog
 *  - FAB → /chat for new project
 *  - Floating bottom nav
 */
@Component({
  selector: 'app-projects-screen',
  standalone: true,
  imports: [CommonModule, RouterModule, BackgroundGridComponent, BottomNavComponent],
  template: `
    <div class="relative flex flex-col min-h-screen bg-arch-bg overflow-hidden">
      <app-background-grid [opacity]="0.16" />

      <!-- ── App bar ── -->
      <header class="relative z-10 flex items-center justify-between px-5 py-4
                     border-b border-arch-border bg-arch-bg/80 backdrop-blur-sm shrink-0">
        <!-- Menu -->
        <button type="button"
          (click)="drawerOpen.set(true)"
          class="w-9 h-9 flex items-center justify-center rounded-xl
                 text-arch-muted hover:text-white hover:bg-arch-surface transition-all">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/>
          </svg>
        </button>

        <h1 class="font-display text-xl font-bold text-white">Projects</h1>

        <!-- Projects count badge -->
        <div class="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center">
          <span class="text-gold text-xs font-bold">{{ projects().length }}</span>
        </div>
      </header>

      <!-- ── Body ── -->
      <main class="relative z-10 flex-1 overflow-y-auto pb-4">

        <!-- Loading -->
        <div *ngIf="isLoading()" class="flex items-center justify-center h-64">
          <div class="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
        </div>

        <!-- Empty state -->
        <div *ngIf="!isLoading() && projects().length === 0"
          class="flex flex-col items-center justify-center h-64 gap-4 px-8 text-center">
          <svg class="w-[90px] h-[90px] text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"/>
          </svg>
          <p class="text-white text-[22px] font-bold">No Projects Yet</p>
          <p class="text-white/60 leading-relaxed text-sm">
            Your generated AI designs<br>will appear here.
          </p>
        </div>

        <!-- Project cards -->
        <div *ngIf="!isLoading() && projects().length > 0"
          class="px-4 pt-5 space-y-[18px]">

          <div
            *ngFor="let project of projects(); let i = index"
            (click)="openProject(project)"
            class="group bg-arch-surface border border-gold/[0.18] rounded-[28px]
                   shadow-[0_8px_16px_rgba(0,0,0,0.22)] cursor-pointer
                   hover:border-gold/40 hover:shadow-gold/10 hover:shadow-lg
                   active:scale-[0.99] transition-all duration-200 overflow-hidden
                   animate-fade-up"
          >
            <!-- Image preview (220 px tall) -->
            <div *ngIf="isBase64(project.result)"
              class="w-full h-[220px] overflow-hidden rounded-t-[28px] bg-arch-bg relative">
              <img
                [src]="toDataUri(project.result)"
                alt="Project preview"
                class="w-full h-full object-cover transition-transform duration-300
                       group-hover:scale-105"
                loading="lazy"
              />
              <!-- Gradient overlay at bottom -->
              <div class="absolute bottom-0 inset-x-0 h-12
                          bg-gradient-to-t from-arch-surface/80 to-transparent"></div>
            </div>

            <!-- Card body -->
            <div class="p-[18px]">

              <!-- Top row: icon + title + delete -->
              <div class="flex items-center gap-3.5">

                <!-- Icon badge -->
                <div class="w-[52px] h-[52px] shrink-0 rounded-2xl bg-gold/[0.12]
                            flex items-center justify-center">
                  <svg class="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                  </svg>
                </div>

                <!-- Text -->
                <div class="flex-1 min-w-0">
                  <p class="text-gold font-bold text-[16px] leading-tight">AI Generated Design</p>
                  <p class="text-white/55 text-xs mt-1">Tap to view full project</p>
                </div>

                <!-- Delete button -->
                <button type="button"
                  (click)="confirmDelete($event, project, i)"
                  class="w-9 h-9 flex items-center justify-center rounded-xl
                         text-red-400 hover:bg-red-500/10 transition-all
                         active:scale-90 shrink-0">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                  </svg>
                </button>
              </div>

              <!-- Prompt text -->
              <p class="mt-4 text-white text-[15px] leading-[1.6] font-medium
                        line-clamp-3">
                {{ project.prompt || 'No description.' }}
              </p>
            </div>
          </div>

        </div>
      </main>

      <!-- ── Bottom nav ── -->
      <div class="relative z-20 shrink-0">
        <app-bottom-nav />
      </div>

      <!-- ── FAB: New Project ── -->
      <button type="button"
        (click)="router.navigateByUrl('/chat')"
        class="fixed bottom-[88px] right-5 z-30
               flex items-center gap-2 px-5 py-3 rounded-2xl
               bg-gold text-black font-bold text-sm
               shadow-[0_8px_24px_rgba(201,168,76,0.35)]
               hover:opacity-90 active:scale-95 transition-all duration-150">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        New Project
      </button>

      <!-- ── Delete confirmation dialog ── -->
      <div *ngIf="deleteTarget()"
        class="fixed inset-0 z-50 flex items-center justify-center px-6"
        (click)="deleteTarget.set(null)">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <div
          class="relative w-full max-w-sm bg-arch-surface border border-arch-border
                 rounded-[24px] p-6 shadow-2xl"
          (click)="$event.stopPropagation()">

          <!-- Icon -->
          <div class="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
            </svg>
          </div>

          <h3 class="text-white text-xl font-bold text-center mb-2">Delete Project</h3>
          <p class="text-arch-muted text-sm text-center leading-relaxed mb-6">
            Are you sure you want to delete this project? This cannot be undone.
          </p>

          <div class="flex gap-3">
            <button type="button"
              (click)="deleteTarget.set(null)"
              class="flex-1 py-2.5 rounded-xl border border-arch-border
                     text-white/70 text-sm font-medium hover:bg-arch-surface transition-colors">
              Cancel
            </button>
            <button type="button"
              (click)="executeDelete()"
              class="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30
                     text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProjectsScreenComponent implements OnInit {
  firstName  = signal('User');
  projects   = signal<ProjectDoc[]>([]);
  isLoading  = signal(true);
  deleteTarget = signal<{ project: ProjectDoc; index: number } | null>(null);

  constructor(
    public router: Router,
    private authService: AuthService,
    private userService: UserService,
    private firestoreService: FirestoreService,
  ) {}

  async ngOnInit(): Promise<void> {
    const uid = this.authService.currentUser?.uid;

    // Load user name
    if (uid) {
      this.userService.getUserData(uid)
        .then((u) => this.firstName.set(u.firstName || 'User'))
        .catch(() => {});
    }

    await this.loadProjects();
  }

  async loadProjects(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await this.firestoreService.getProjects();
      this.projects.set(data);
    } catch {
      this.projects.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  openProject(project: ProjectDoc): void {
    this.router.navigateByUrl('/projects/' + project.id, {
      state: { project },
    });
  }

  confirmDelete(event: Event, project: ProjectDoc, index: number): void {
    event.stopPropagation(); // don't open details
    this.deleteTarget.set({ project, index });
  }

  async executeDelete(): Promise<void> {
    const target = this.deleteTarget();
    if (!target) return;

    this.deleteTarget.set(null);

    try {
      await this.firestoreService.deleteProject(target.project.id);
      this.projects.update((list) => list.filter((_, i) => i !== target.index));
    } catch {
      // silently ignore – reload to sync
      await this.loadProjects();
    }
  }

  // ── Image helpers ─────────────────────────────────────────
  isBase64(value: string): boolean {
    if (!value) return false;
    return (
      value.startsWith('data:image') ||
      value.startsWith('/9j/')       ||
      value.startsWith('iVBOR')      ||
      value.length > 1000
    );
  }

  toDataUri(value: string): string {
    if (value.startsWith('data:')) return value;
    const mime = value.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
    return `data:${mime};base64,${value}`;
  }

  drawerOpen = signal(false);
}
