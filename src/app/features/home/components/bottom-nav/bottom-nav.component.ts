import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

export interface NavItem {
  label: string;
  route: string;
  icon: 'home' | 'folder' | 'person' | 'settings';
}

/**
 * BottomNavComponent – Angular standalone rewrite of Flutter's BottomNav widget.
 *
 * Renders the pill-shaped floating bottom navigation bar with gold icons.
 * Highlights the active route using routerLinkActive.
 */
@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="px-6 pb-6">
      <nav
        class="bg-arch-surface border border-gold/20 rounded-[22px]
               shadow-sm shadow-black/10 px-2 py-2.5
               flex items-center justify-around"
      >
        <button
          *ngFor="let item of items"
          type="button"
          (click)="navigate(item.route)"
          class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl
                 transition-all duration-150 active:scale-90"
          [ngClass]="isActive(item.route)
            ? 'text-gold'
            : 'text-white/50 hover:text-white/80'"
        >
          <!-- Home -->
          <ng-container *ngIf="item.icon === 'home'">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
            </svg>
          </ng-container>

          <!-- Folder / Projects -->
          <ng-container *ngIf="item.icon === 'folder'">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"/>
            </svg>
          </ng-container>

          <!-- Person / Profile -->
          <ng-container *ngIf="item.icon === 'person'">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
            </svg>
          </ng-container>

          <!-- Settings -->
          <ng-container *ngIf="item.icon === 'settings'">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </ng-container>

          <span class="text-[11px] font-medium leading-none">{{ item.label }}</span>

          <!-- Active dot -->
          <span
            *ngIf="isActive(item.route)"
            class="w-1 h-1 rounded-full bg-gold"
          ></span>
        </button>
      </nav>
    </div>
  `,
})
export class BottomNavComponent {
  @Input() activeRoute = '/home';

  readonly items: NavItem[] = [
    { label: 'Home',     route: '/home',     icon: 'home'     },
    { label: 'Projects', route: '/projects', icon: 'folder'   },
    { label: 'Profile',  route: '/profile',  icon: 'person'   },
    { label: 'Settings', route: '/settings', icon: 'settings' },
  ];

  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigateByUrl(route);
  }

  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }
}
