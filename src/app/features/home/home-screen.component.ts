import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { UserService } from "../../core/services/user.service";
import { BackgroundGridComponent } from "../shared/components/background-grid/background-grid.component";
import { ActionCardComponent } from "./components/action-card/action-card.component";
import { AnimatedActionCardComponent } from "./components/animated-action-card/animated-action-card.component";
import { BottomNavComponent } from "./components/bottom-nav/bottom-nav.component";
import { StatCardComponent } from "./components/stat-card/stat-card.component";

/**
 * HomeScreenComponent – full Angular rewrite of Flutter's HomeScreen.
 *
 * Structure mirrors the Flutter CustomScrollView with SliverToBoxAdapter sections:
 *  1. Top bar   (menu button ∙ logo ∙ notification bell)
 *  2. Hero card (welcome, description, stat cards)
 *  3. Quick Actions section header
 *  4. Staggered AnimatedActionCards (Create / Projects / AI Assistant)
 *  5. Floating BottomNav
 */
@Component({
  selector: "app-home-screen",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BackgroundGridComponent,
    ActionCardComponent,
    AnimatedActionCardComponent,
    BottomNavComponent,
    StatCardComponent,
  ],
  template: `
    <div class="relative flex flex-col min-h-screen bg-arch-bg overflow-hidden">
      <app-background-grid [opacity]="0.16" />

      <!-- ══════════════════════════════════════
           Scrollable body
      ══════════════════════════════════════ -->
      <main class="relative z-10 flex-1 overflow-y-auto pb-2" #scrollBody>
        <!-- ── TOP BAR ── -->
        <div class="flex items-center justify-between px-5 pt-safe pt-5 pb-2">
          <!-- Menu button -->
          <button
            type="button"
            (click)="drawerOpen.set(!drawerOpen())"
            class="w-[52px] h-[52px] flex items-center justify-center rounded-[18px]
                   bg-[#1C1C1C] border border-gold/[0.22]
                   shadow-[0_6px_14px_rgba(0,0,0,0.25)]
                   active:scale-90 transition-all duration-150"
          >
            <svg
              class="w-7 h-7 text-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
              />
            </svg>
          </button>

          <!-- Logo pill -->
          <div
            class="flex items-center gap-2.5 px-5 py-3 rounded-[20px]
                      bg-gradient-to-r from-[#1C1C1C] to-[#1C1C1C]/80
                      border border-gold/20 shadow-[0_0_22px_rgba(201,168,76,0.08)]"
          >
            <!-- Arch SVG icon -->
            <svg
              class="w-[30px] h-[30px] text-gold"
              fill="none"
              viewBox="0 0 32 32"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 28 L4 16 Q4 4 16 4 Q28 4 28 16 L28 28"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 28 L10 18 Q10 10 16 10 Q22 10 22 18 L22 28"
              />
            </svg>
            <span class="text-gold font-extrabold text-[20px] tracking-wide"
              >ArchAi</span
            >
          </div>

          <!-- Notification bell -->
          <div
            class="w-[52px] h-[52px] flex items-center justify-center rounded-[18px]
                      bg-[#1C1C1C] border border-gold/20 relative"
          >
            <svg
              class="w-5 h-5 text-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
            <!-- Unread dot -->
            <span
              class="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-gold ring-2 ring-arch-bg"
            ></span>
          </div>
        </div>

        <!-- ── HERO CARD ── -->
        <div class="px-6 pt-4 pb-1">
          <div
            class="w-full rounded-[34px] p-6 border border-gold/25
                   shadow-[0_0_30px_rgba(201,168,76,0.08)]
                   bg-gradient-to-br from-gold/[0.18] via-[#1C1C1C] to-[#111111]
                   transition-all duration-700"
            [class.opacity-0]="!heroVisible()"
            [class.translate-y-8]="!heroVisible()"
            [class.opacity-100]="heroVisible()"
            [class.translate-y-0]="heroVisible()"
            style="transition: opacity 700ms ease, transform 700ms ease"
          >
            <!-- AI badge -->
            <div
              class="inline-flex items-center gap-2 px-3.5 py-2 rounded-full
                        bg-gold/[0.12] border border-gold/25"
            >
              <svg
                class="w-4 h-4 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
              <span class="text-gold font-semibold text-sm"
                >AI-Powered Architecture</span
              >
            </div>

            <!-- Welcome heading -->
            <div class="mt-6 mb-4">
              <p class="text-white/70 text-lg leading-relaxed">Welcome back,</p>
              <p
                class="text-gold text-[36px] font-black tracking-wide leading-tight"
              >
                {{ firstName()
                }}<span *ngIf="lastName()"> {{ lastName() }}</span>
              </p>
            </div>

            <!-- Description -->
            <p class="text-white/70 text-[15px] leading-[1.8]">
              Design modern architectural projects using advanced AI tools and
              generate smart layouts in seconds.
            </p>

            <!-- Stat cards row -->
            <div class="flex gap-3.5 mt-7">
              <app-stat-card value="24" label="Projects">
                <svg
                  icon
                  class="w-7 h-7 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                  />
                </svg>
              </app-stat-card>

              <app-stat-card value="120+" label="AI Designs">
                <svg
                  icon
                  class="w-7 h-7 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                  />
                </svg>
              </app-stat-card>
            </div>
          </div>
        </div>

        <!-- ── QUICK ACTIONS HEADER ── -->
        <div class="px-6 pt-8 pb-0">
          <h2 class="text-white text-2xl font-extrabold">Quick Actions</h2>
          <p class="text-white/60 text-sm mt-1.5 leading-relaxed">
            Access your AI tools and architectural workspace.
          </p>
        </div>

        <!-- ── ACTION CARDS ── -->
        <div class="px-6 pt-7 pb-10 flex flex-col gap-[18px]">
          <!-- Create Project -->
          <app-animated-action-card [delayMs]="100">
            <app-action-card
              title="Create Project"
              subtitle="Generate AI floor plans & concepts"
              (tapped)="router.navigateByUrl('/chat')"
            >
              <svg
                icon
                class="w-6 h-6 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M4.5 3v18M19.5 3v18"
                />
              </svg>
            </app-action-card>
          </app-animated-action-card>

          <!-- Projects -->
          <app-animated-action-card [delayMs]="200">
            <app-action-card
              title="Projects"
              subtitle="Manage your saved designs"
              (tapped)="router.navigateByUrl('/projects')"
            >
              <svg
                icon
                class="w-6 h-6 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                />
              </svg>
            </app-action-card>
          </app-animated-action-card>

          <!-- AI Assistant -->
          <app-animated-action-card [delayMs]="300">
            <app-action-card
              title="AI Assistant"
              subtitle="Build your own smart AI architect"
              (tapped)="router.navigateByUrl('/bot')"
            >
              <svg
                icon
                class="w-6 h-6 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.75 3.75h4.5M12 3.75V6m-6 2.25h12a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5v-7.5A1.5 1.5 0 016 8.25zM9 12.75h.008v.008H9v-.008zm3 0h.008v.008H12v-.008zm3 0h.008v.008H15v-.008z"
                />
              </svg>
            </app-action-card>
          </app-animated-action-card>
        </div>
      </main>

      <!-- ── BOTTOM NAV ── -->
      <div class="relative z-20 shrink-0">
        <app-bottom-nav />
      </div>

      <!-- ══════════════════════════════════════
           Side Drawer overlay
      ══════════════════════════════════════ -->
      <div
        *ngIf="drawerOpen()"
        class="fixed inset-0 z-30 flex"
        (click)="drawerOpen.set(false)"
      >
        <!-- Scrim -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <!-- Drawer panel -->
        <aside
          class="relative w-72 max-w-[80vw] h-full bg-arch-surface border-r border-arch-border
                 flex flex-col py-10 px-6 gap-2"
          (click)="$event.stopPropagation()"
        >
          <!-- Brand -->
          <div class="flex items-center gap-3 mb-8">
            <svg
              class="w-8 h-8 text-gold"
              fill="none"
              viewBox="0 0 32 32"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 28 L4 16 Q4 4 16 4 Q28 4 28 16 L28 28"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 28 L10 18 Q10 10 16 10 Q22 10 22 18 L22 28"
              />
            </svg>
            <span class="text-gold font-bold text-xl tracking-wide"
              >ArchAi</span
            >
          </div>

          <!-- Nav links -->
          <a
            *ngFor="let link of drawerLinks"
            [routerLink]="link.route"
            (click)="drawerOpen.set(false)"
            class="flex items-center gap-3 px-4 py-3 rounded-xl
                   text-white/70 hover:text-white hover:bg-gold/10 transition-all text-sm font-medium"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-gold/50"></span>
            {{ link.label }}
          </a>

          <div class="flex-1"></div>

          <!-- Logout -->
          <button
            type="button"
            (click)="logout()"
            class="flex items-center gap-3 px-4 py-3 rounded-xl
                   text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </aside>
      </div>
    </div>
  `,
})
export class HomeScreenComponent implements OnInit {
  firstName = signal("User");
  lastName = signal("");
  heroVisible = signal(false);
  drawerOpen = signal(false);

  readonly drawerLinks = [
    { label: "Home", route: "/home" },
    { label: "Create Project", route: "/chat" },
    { label: "Projects", route: "/projects" },
    { label: "AI Bot", route: "/bot" },
    { label: "Profile", route: "/profile" },
    { label: "Settings", route: "/settings" },
  ];

  constructor(
    public router: Router,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async ngOnInit(): Promise<void> {
    // Hero card entrance animation – mirrors Flutter's 700 ms TweenAnimationBuilder
    setTimeout(() => this.heroVisible.set(true), 50);

    const uid = this.authService.currentUser?.uid;
    if (!uid) return;

    try {
      const userData = await this.userService.getUserData(uid);
      this.firstName.set(userData.firstName || "User");
      this.lastName.set(userData.lastName || "");
    } catch {
      /* keep default */
    }
  }

  async logout(): Promise<void> {
    this.drawerOpen.set(false);
    await this.authService.signOut();
    this.userService.clearUserData();
    this.router.navigateByUrl("/login");
  }
}
