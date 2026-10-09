import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import { ArchLogoComponent } from '../shared/components/arch-logo/arch-logo.component';
import { BackgroundGridComponent } from '../shared/components/background-grid/background-grid.component';

/**
 * SplashComponent – faithful Angular rewrite of Flutter's SplashScreen.
 *
 * Dart source features:
 *  ✓ BackgroundGrid(opacity:0.2)  → BackgroundGridComponent
 *  ✓ ArchLogo spinning 10 s/revolution  → ArchLogoComponent + CSS animate-spin-logo
 *  ✓ "ArchAi" display text in gold (displaySmall + letterSpacing:1.2)
 *  ✓ Tagline in warmBeige (#EAD7C2) titleMedium weight:500
 *  ✓ Spacer() pushes buttons to bottom
 *  ✓ GoldButton "Sign Up" (filled)
 *  ✓ GoldButton "Log In"  (outlined)
 *  ✓ SizedBox(height:40) padding below buttons
 *  ✓ Auto-redirect to /home if already signed in
 */
@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule, RouterModule, ArchLogoComponent, BackgroundGridComponent],
  template: `
    <div class="relative min-h-screen bg-arch-bg flex flex-col overflow-hidden">
      <app-background-grid [opacity]="0.2" />

      <!-- Blueprint decorative triangle (mirrors _GridPainter triangle) -->
      <svg class="absolute pointer-events-none opacity-[0.06]"
        style="top:18%;right:8%;width:clamp(80px,16vw,140px)"
        viewBox="0 0 100 115" fill="none">
        <polygon points="80,20 95,55 65,55" fill="#D4AF37"/>
      </svg>

      <!-- Gold radial glow -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-80 h-80 bg-[#FFD166]/[0.06] rounded-full blur-3xl pointer-events-none">
      </div>

      <!-- Main content – entrance fade (mirrors Flutter's immediate render) -->
      <main
        class="relative z-10 flex flex-col flex-1 items-center px-6
               transition-all duration-500 ease-out"
        [style.opacity]="visible() ? '1' : '0'"
        [style.transform]="visible() ? 'translateY(0)' : 'translateY(16px)'"
      >
        <!-- SizedBox(height:80) -->
        <div class="h-20 shrink-0"></div>

        <!-- ── Logo + Title ── (_LogoAndTitle widget) -->
        <div class="flex flex-col items-center gap-4">

          <!-- ArchLogo spinning at 10 s per revolution -->
          <div style="animation: spin-logo 10s linear infinite; width: 120px; height: 120px;">
            <app-arch-logo [size]="120" />
          </div>

          <!-- "ArchAi" – displaySmall gold letterSpacing:1.2 fontWeight:700 -->
          <h1 class="font-display text-[40px] font-bold text-[#FFD166] text-center"
            style="letter-spacing: 1.2px;">
            ArchAi
          </h1>
        </div>

        <!-- Tagline – titleMedium warmBeige weight:500 -->
        <p class="mt-4 text-[#EAD7C2] text-base font-medium text-center leading-relaxed">
          Design your dream space with AI.
        </p>

        <!-- Spacer() -->
        <div class="flex-1"></div>

        <!-- ── Buttons ── -->
        <div class="w-full space-y-3">

          <!-- GoldButton "Sign Up" – filled -->
          <button type="button"
            (click)="router.navigateByUrl('/signup')"
            class="btn-gold">
            Sign Up
          </button>

          <!-- GoldButton "Log In" – outlined -->
          <button type="button"
            (click)="router.navigateByUrl('/login')"
            class="btn-gold-outlined">
            Log In
          </button>
        </div>

        <!-- SizedBox(height:40) -->
        <div class="h-10 shrink-0"></div>
      </main>
    </div>
  `,
})
export class SplashComponent implements OnInit, OnDestroy {
  visible = signal(false);

  constructor(
    public router: Router,
    private auth: Auth,
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.visible.set(true), 50);

    // Auto-redirect if already authenticated
    authState(this.auth).pipe(take(1)).subscribe((user) => {
      if (user) setTimeout(() => this.router.navigateByUrl('/home'), 400);
    });
  }

  ngOnDestroy(): void {}
}
