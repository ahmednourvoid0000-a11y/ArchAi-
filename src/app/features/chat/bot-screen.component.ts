import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  signal,
  AfterViewChecked,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { AiService } from "../../core/services/ai.service";
import { FirestoreService } from "../../core/services/firestore.service";
import { Message } from "./models/message.model";
import { MessageBubbleComponent } from "./components/message-bubble/message-bubble.component";
import { InputBarComponent } from "./components/input-bar/input-bar.component";
import { BotPreviewComponent } from "./components/bot-preview/bot-preview.component";
import { BackgroundGridComponent } from "../shared/components/background-grid/background-grid.component";

const WELCOME_MESSAGE: Message = {
  text: "Hello! I'm your AI assistant. How can I help you today?",
  isUser: false,
};

@Component({
  selector: "app-bot-screen",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MessageBubbleComponent,
    InputBarComponent,
    BotPreviewComponent,
    BackgroundGridComponent,
  ],
  template: `
    <div class="relative flex flex-col h-screen bg-arch-bg overflow-hidden">
      <app-background-grid [opacity]="0.16" />

      <!-- ── Top bar ── -->
      <header
        class="relative z-10 flex items-center justify-between px-5 py-4
                     border-b border-arch-border bg-arch-bg/80 backdrop-blur-sm shrink-0"
      >
        <!-- Back -->
        <a
          routerLink="/home"
          class="flex items-center gap-1.5 text-arch-muted hover:text-white transition-colors text-sm"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </a>

        <!-- Title -->
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
          <span class="font-display text-lg font-semibold text-white"
            >AI Bot</span
          >
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1">
          <!-- New chat -->
          <button
            type="button"
            title="New chat"
            class="w-9 h-9 rounded-lg flex items-center justify-center
                   text-arch-muted hover:text-white hover:bg-arch-surface transition-all"
            (click)="newChat()"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          <!-- Clear / delete -->
          <button
            type="button"
            title="Clear chat"
            class="w-9 h-9 rounded-lg flex items-center justify-center
                   text-arch-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
            (click)="clearChat()"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </header>

      <!-- ── Message list ── -->
      <main
        #scrollContainer
        class="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-1"
      >
        <ng-container *ngFor="let msg of messages()">
          <!-- Preview bubble -->
          <app-bot-preview *ngIf="msg.isPreview" />

          <!-- Regular message -->
          <app-message-bubble
            *ngIf="!msg.isPreview"
            [text]="msg.text"
            [isUser]="msg.isUser"
          />
        </ng-container>

        <!-- Typing indicator -->
        <div *ngIf="isLoading()" class="flex justify-start my-2">
          <div
            class="w-7 h-7 rounded-full bg-gold/10 border border-gold/20
                      flex items-center justify-center mr-2 mt-1 shrink-0"
          >
            <svg
              class="w-4 h-4 text-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 3.75h4.5M12 3.75V6m-6 2.25h12a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5v-7.5A1.5 1.5 0 016 8.25z"
              />
            </svg>
          </div>
          <div
            class="bg-arch-surface border border-arch-border rounded-2xl rounded-bl-sm
                      px-4 py-3 flex items-center gap-1.5"
          >
            <span
              class="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0ms]"
            ></span>
            <span
              class="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:150ms]"
            ></span>
            <span
              class="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:300ms]"
            ></span>
          </div>
        </div>

        <!-- Scroll anchor -->
        <div #scrollAnchor></div>
      </main>

      <!-- ── Input bar ── -->
      <div class="relative z-10 shrink-0">
        <app-input-bar
          hintText="How can I help you…"
          [loading]="isLoading()"
          (send)="handleSend($event)"
        />
      </div>

      <!-- Error toast -->
      <div
        *ngIf="errorMsg()"
        class="absolute bottom-24 left-1/2 -translate-x-1/2 z-20
               flex items-center gap-2 bg-red-500/10 border border-red-500/30
               rounded-xl px-4 py-2.5 text-red-400 text-sm whitespace-nowrap
               animate-fade-up shadow-xl"
      >
        <svg
          class="w-4 h-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {{ errorMsg() }}
      </div>
    </div>
  `,
})
export class BotScreenComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild("scrollAnchor") private scrollAnchor!: ElementRef<HTMLDivElement>;

  messages = signal<Message[]>([]);
  isLoading = signal(false);
  errorMsg = signal("");

  private shouldScroll = false;

  constructor(
    private authService: AuthService,
    private aiService: AiService,
    private firestoreService: FirestoreService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadMessages();
  }

  ngOnDestroy(): void {}

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Load persisted messages from Firestore
  // ─────────────────────────────────────────────────────────────
  private async loadMessages(): Promise<void> {
    if (!this.authService.currentUser) return;

    try {
      const loaded = await this.firestoreService.loadBotMessages();
      this.messages.set(loaded.length > 0 ? loaded : [{ ...WELCOME_MESSAGE }]);
    } catch {
      this.messages.set([{ ...WELCOME_MESSAGE }]);
    }

    this.shouldScroll = true;
  }

  // ─────────────────────────────────────────────────────────────
  // New chat (in-memory only, does NOT clear Firestore)
  // ─────────────────────────────────────────────────────────────
  newChat(): void {
    this.aiService.clearChat();
    this.messages.set([{ text: "New chat started 👋", isUser: false }]);
    this.shouldScroll = true;
  }

  // ─────────────────────────────────────────────────────────────
  // Clear chat (Firestore + in-memory)
  // ─────────────────────────────────────────────────────────────
  async clearChat(): Promise<void> {
    try {
      await this.firestoreService.clearBotChat();
      this.aiService.clearChat();
      this.messages.set([{ ...WELCOME_MESSAGE }]);
      this.shouldScroll = true;
    } catch {
      this.showError("Failed to clear chat.");
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Handle send – save → optimistic UI → AI call → response
  // ─────────────────────────────────────────────────────────────
  async handleSend(text: string): Promise<void> {
    if (!text.trim()) return;

    // 1. Persist user message
    try {
      await this.firestoreService.saveBotMessage(text, true);
    } catch {
      /* non-fatal – still show in UI */
    }

    // 2. Optimistic update
    this.messages.update((msgs) => [...msgs, { text, isUser: true }]);
    this.isLoading.set(true);
    this.shouldScroll = true;

    try {
      // 3. Send to AI
      await this.aiService.sendMessage(text);
      const aiResponse = await this.aiService.getResponse();

      // 4. Persist AI response
      try {
        await this.firestoreService.saveBotMessage(aiResponse, false);
      } catch {
        /* non-fatal */
      }

      // 5. Append AI message
      this.messages.update((msgs) => [
        ...msgs,
        { text: aiResponse, isUser: false },
      ]);
    } catch {
      this.messages.update((msgs) => [
        ...msgs,
        {
          text: "Error: Failed to connect to AI. Please try again.",
          isUser: false,
        },
      ]);
      this.showError("AI connection failed.");
    } finally {
      this.isLoading.set(false);
      this.shouldScroll = true;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────
  private scrollToBottom(): void {
    try {
      this.scrollAnchor?.nativeElement.scrollIntoView({ behavior: "smooth" });
    } catch {
      /* ignore */
    }
  }

  private showError(msg: string): void {
    this.errorMsg.set(msg);
    setTimeout(() => this.errorMsg.set(""), 4000);
  }
}
