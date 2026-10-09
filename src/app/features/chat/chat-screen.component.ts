import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { DesignService } from "../../core/services/design.service";
import {
  FirestoreService,
  ProjectDoc,
} from "../../core/services/firestore.service";
import { Message } from "./models/message.model";
import { InputBarComponent } from "./components/input-bar/input-bar.component";
import { MessageBubbleComponent } from "./components/message-bubble/message-bubble.component";
import { PlanPreviewBubbleComponent } from "./components/plan-preview-bubble/plan-preview-bubble.component";
import { ImageBubbleComponent } from "./components/image-bubble/image-bubble.component";
import { BackgroundGridComponent } from "../shared/components/background-grid/background-grid.component";

const WELCOME: Message = {
  text: "Hello! I'm your AI architectural assistant. Please describe your apartment – tell me about the size, number of rooms, bathrooms, and any specific requirements you have.",
  isUser: false,
};

@Component({
  selector: "app-chat-screen",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    InputBarComponent,
    MessageBubbleComponent,
    PlanPreviewBubbleComponent,
    ImageBubbleComponent,
    BackgroundGridComponent,
  ],
  template: `
    <div class="relative flex flex-col h-screen bg-arch-bg overflow-hidden">
      <app-background-grid [opacity]="0.16" />

      <!-- ── Header ── -->
      <header
        class="relative z-10 flex items-center justify-between px-5 py-4
                     border-b border-arch-border bg-arch-bg/80 backdrop-blur-sm shrink-0"
      >
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

        <!-- Title + badge -->
        <div class="flex flex-col items-center">
          <span class="font-display text-lg font-semibold text-white"
            >Create Project</span
          >
          <span
            class="text-[10px] uppercase tracking-widest text-gold/70 font-medium"
          >
            AI Architectural Design
          </span>
        </div>

        <!-- Projects link + delete last project -->
        <div class="flex items-center gap-3">
          <a
            routerLink="/projects"
            class="text-arch-muted hover:text-gold transition-colors"
            title="My Projects"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
              />
            </svg>
          </a>

          <button
            (click)="saveAndReset()"
            type="button"
            title="Save project and reset chat"
            class="text-arch-muted hover:text-gold transition-colors"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 5v14a2 2 0 002 2h10a2 2 0 002-2V7L16 3H7a2 2 0 00-2 2z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v6h6"
              />
            </svg>
          </button>

          <button
            (click)="onDeleteLatest()"
            type="button"
            class="text-arch-muted hover:text-red-400 transition-colors"
            title="Delete most recent project"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20 7l-1 13a2 2 0 01-2 2H7a2 2 0 01-2-2L4 7m5 4v6m4-6v6M1 7h22M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
              />
            </svg>
          </button>
        </div>
      </header>

      <!-- ── Message list ── -->
      <main
        #scrollContainer
        class="relative z-10 flex-1 overflow-y-auto px-4 py-4"
      >
        <ng-container *ngFor="let msg of messages(); let i = index">
          <!-- Plan preview card -->
          <app-plan-preview-bubble
            *ngIf="msg.isPreview"
            (save)="onSaveDesign(i)"
          />

          <!-- AI-generated image (base64) -->
          <app-image-bubble
            *ngIf="!msg.isPreview && !msg.isUser && isBase64Image(msg.text)"
            [base64]="msg.text"
          />

          <!-- Regular text bubble -->
          <div
            *ngIf="!msg.isPreview && !(!msg.isUser && isBase64Image(msg.text))"
            class="relative"
          >
            <app-message-bubble [text]="msg.text" [isUser]="msg.isUser" />
            <button
              type="button"
              (click)="deleteMessage(i)"
              class="absolute -top-1 right-0 text-arch-muted hover:text-red-400 px-2"
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
                  d="M20 7l-1 13a2 2 0 01-2 2H7a2 2 0 01-2-2L4 7m5 4v6m4-6v6M1 7h22M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
                />
              </svg>
            </button>
          </div>
        </ng-container>

        <!-- Generating indicator -->
        <div
          *ngIf="isGenerating()"
          class="flex justify-start my-2 animate-fade-up"
        >
          <div
            class="flex items-center gap-3 bg-arch-surface border border-arch-border
                      rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs"
          >
            <!-- Animated architectural blueprint icon -->
            <div
              class="w-8 h-8 rounded-lg border border-gold/30 bg-gold/5
                        flex items-center justify-center shrink-0"
            >
              <svg
                class="w-4 h-4 text-gold animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
            <div>
              <p class="text-white text-sm font-medium">Generating design</p>
              <p class="text-arch-muted text-xs">
                AI is rendering your floor plan…
              </p>
            </div>
          </div>
        </div>

        <div #scrollAnchor></div>
      </main>

      <!-- ── Input bar ── -->
      <div class="relative z-10 shrink-0">
        <!-- Decorative top gradient -->
        <div
          class="h-6 bg-gradient-to-t from-arch-bg to-transparent pointer-events-none -mt-6 relative z-10"
        ></div>

        <app-input-bar
          [hintText]="
            isGenerating() ? 'Generating Design…' : 'Describe Your Space…'
          "
          [loading]="isGenerating()"
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

      <!-- Success toast -->
      <div
        *ngIf="successMsg()"
        class="absolute bottom-24 left-1/2 -translate-x-1/2 z-20
               flex items-center gap-2 bg-green-500/10 border border-green-500/30
               rounded-xl px-4 py-2.5 text-green-400 text-sm whitespace-nowrap
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
            d="M5 13l4 4L19 7"
          />
        </svg>
        {{ successMsg() }}
      </div>
      <!-- Project picker modal -->
      <div
        *ngIf="pickerOpen()"
        class="fixed inset-0 z-50 flex items-center justify-center px-6"
        (click)="pickerOpen.set(false)"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <div
          class="relative w-full max-w-lg bg-arch-surface border border-arch-border rounded-[24px] p-6"
          (click)="$event.stopPropagation()"
        >
          <h3 class="text-white text-lg font-bold mb-2">Delete a Project</h3>
          <p class="text-arch-muted text-sm mb-4">
            Select a project to delete. This cannot be undone.
          </p>

          <div
            *ngIf="pickerLoading()"
            class="flex items-center justify-center py-8"
          >
            <div
              class="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin"
            ></div>
          </div>

          <div
            *ngIf="!pickerLoading() && pickerProjects().length === 0"
            class="text-white/60 py-6 text-center"
          >
            No saved projects.
          </div>

          <div *ngIf="!pickerLoading()">
            <div
              *ngFor="let p of pickerProjects(); let i = index"
              class="flex items-center gap-3 py-2 border-b border-arch-border/40"
            >
              <img
                *ngIf="p.result"
                [src]="toDataUri(p.result)"
                alt="preview"
                class="w-16 h-12 object-cover rounded-md"
              />
              <div class="flex-1 min-w-0">
                <div class="text-white font-medium line-clamp-1">
                  {{ p.prompt || p.name }}
                </div>
                <div class="flex items-center gap-3 text-arch-muted text-xs">
                  <span>{{ p.name }}</span>
                  <span *ngIf="p.createdAt"
                    >• {{ p.createdAt | date: "medium" }}</span
                  >
                </div>
              </div>
              <button
                (click)="deletePickerProject(p.id, i)"
                type="button"
                class="px-3 py-2 rounded-xl bg-red-500/20 text-red-400"
              >
                Delete
              </button>
            </div>
          </div>

          <div class="mt-4 text-right">
            <button
              (click)="pickerOpen.set(false)"
              class="py-2 px-4 rounded-xl border border-arch-border text-white/70"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ChatScreenComponent implements OnInit, AfterViewChecked {
  @ViewChild("scrollAnchor") private scrollAnchor!: ElementRef<HTMLDivElement>;

  messages = signal<Message[]>([{ ...WELCOME }]);
  isGenerating = signal(false);
  errorMsg = signal("");
  successMsg = signal("");
  // Project picker for deleting a specific project
  pickerOpen = signal(false);
  pickerLoading = signal(false);
  pickerProjects = signal<ProjectDoc[]>([]);
  // track Firestore ids for design_chats in the same order as `messages`
  messageIds = signal<string[]>([]);

  private shouldScroll = false;

  constructor(
    private authService: AuthService,
    private designService: DesignService,
    private firestoreService: FirestoreService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadMessages();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollAnchor?.nativeElement.scrollIntoView({ behavior: "smooth" });
      this.shouldScroll = false;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Load persisted design_chats from Firestore
  // ─────────────────────────────────────────────────────────────
  private async loadMessages(): Promise<void> {
    if (!this.authService.currentUser) return;

    try {
      const loaded = await this.designService.loadDesignMessages();
      if (loaded.length > 0) {
        // loaded contains id + text
        this.messages.set(
          loaded.map((d) => ({
            text: d.text,
            isUser: d.isUser,
            isPreview: d.isPreview,
          })),
        );
        this.messageIds.set(loaded.map((d) => d.id));
        this.shouldScroll = true;
      }
    } catch {
      /* keep welcome message */
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Detect base64 image string – mirrors Flutter _isBase64Image
  // ─────────────────────────────────────────────────────────────
  isBase64Image(text: string): boolean {
    return (
      text.startsWith("iVBOR") || // PNG
      text.startsWith("/9j/") || // JPEG
      text.length > 1000 // fallback heuristic
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Handle send: user msg → save → AI image → save
  // ─────────────────────────────────────────────────────────────
  async handleSend(text: string): Promise<void> {
    if (!text.trim() || this.isGenerating()) return;

    this.isGenerating.set(true);

    // 1. Optimistic user message
    this.messages.update((msgs) => [...msgs, { text, isUser: true }]);
    this.shouldScroll = true;

    // Persist user message (non-fatal)
    this.designService
      .saveDesignMessage(text, true)
      .then((id) => {
        if (id) this.messageIds.update((ids) => [...ids, id]);
      })
      .catch(() => {});

    try {
      // 2. Generate image
      const imageBase64 = await this.designService.generateImage(text);

      if (imageBase64) {
        // 3. Save project to Firestore
        this.designService
          .createProject({
            name: "AI Project",
            prompt: text,
            result: imageBase64,
          })
          .catch(() => {});

        // 4. Append image message
        this.messages.update((msgs) => [
          ...msgs,
          { text: imageBase64, isUser: false },
        ]);

        // Persist image message (non-fatal) and store id
        this.designService
          .saveDesignMessage(imageBase64, false)
          .then((id) => {
            if (id) this.messageIds.update((ids) => [...ids, id]);
          })
          .catch(() => {});
      } else {
        this.messages.update((msgs) => [
          ...msgs,
          {
            text: "Failed to generate image. Please try again.",
            isUser: false,
          },
        ]);
      }
    } catch (err) {
      console.error("CHAT ERROR:", err);
      this.messages.update((msgs) => [
        ...msgs,
        { text: "Error generating design. Please try again.", isUser: false },
      ]);
      this.showError("Generation failed. Check your API key.");
    } finally {
      this.isGenerating.set(false);
      this.shouldScroll = true;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Save design from PlanPreviewBubble
  // ─────────────────────────────────────────────────────────────
  async onSaveDesign(index: number): Promise<void> {
    // Find the most recent base64 image before this preview bubble
    const msgs = this.messages();
    const imageMsg = [...msgs]
      .reverse()
      .find((m) => !m.isUser && this.isBase64Image(m.text));

    if (!imageMsg) {
      this.showError("No design found to save.");
      return;
    }

    try {
      await this.designService.createProject({
        name: "Saved Design",
        prompt: msgs.find((m) => m.isUser)?.text ?? "",
        result: imageMsg.text,
      });
      this.showSuccess("Design saved to your projects!");
    } catch {
      this.showError("Failed to save design.");
    }
  }

  // Save current chat as a project and reset chat to default
  async saveAndReset(): Promise<void> {
    const msgs = this.messages();
    const imageMsg = [...msgs]
      .reverse()
      .find((m) => !m.isUser && this.isBase64Image(m.text));

    if (!imageMsg) {
      this.showError("No design found to save.");
      return;
    }

    try {
      await this.designService.createProject({
        name: "Saved Design",
        prompt: msgs.find((m) => m.isUser)?.text ?? "",
        result: imageMsg.text,
      });

      // clear persisted chat messages and reset UI
      await this.designService.clearDesignMessages();
      this.messages.set([{ ...WELCOME }]);
      this.shouldScroll = false;
      this.showSuccess("Design saved and chat reset.");
    } catch (e) {
      console.error("SAVE AND RESET ERROR:", e);
      this.showError("Failed to save design.");
    }
  }

  // Open project picker to delete a specific project
  async onDeleteLatest(): Promise<void> {
    this.pickerOpen.set(true);
    await this.loadPickerProjects();
  }

  private async loadPickerProjects(): Promise<void> {
    this.pickerLoading.set(true);
    try {
      const data = await this.firestoreService.getProjects();
      this.pickerProjects.set(data);
    } catch (e) {
      console.error("LOAD PROJECTS ERROR:", e);
      this.showError("Failed to load projects.");
      this.pickerProjects.set([]);
    } finally {
      this.pickerLoading.set(false);
    }
  }

  async deletePickerProject(projectId: string, index: number): Promise<void> {
    const ok = confirm("Delete this project? This cannot be undone.");
    if (!ok) return;

    try {
      await this.firestoreService.deleteProject(projectId);
      this.pickerProjects.update((list) => list.filter((_, i) => i !== index));
      this.showSuccess("Project deleted.");
    } catch (e) {
      console.error("DELETE PROJECT ERROR:", e);
      this.showError("Failed to delete project.");
      await this.loadPickerProjects();
    }
  }

  // Delete a single chat message by index (and from Firestore if saved)
  async deleteMessage(index: number): Promise<void> {
    const ids = this.messageIds();
    const msgs = this.messages();

    // If there's a stored doc id, delete from Firestore
    const id = ids[index];
    if (id) {
      try {
        await this.designService.deleteDesignMessage(id);
      } catch (e) {
        console.error("DELETE MESSAGE ERROR:", e);
        this.showError("Failed to delete message.");
        return;
      }
      this.messageIds.update((arr) => arr.filter((_, i) => i !== index));
    }

    // Remove from UI messages regardless
    this.messages.update((arr) => arr.filter((_, i) => i !== index));
    this.showSuccess("Message deleted.");
  }

  // ─────────────────────────────────────────────────────────────
  private showError(msg: string): void {
    this.errorMsg.set(msg);
    setTimeout(() => this.errorMsg.set(""), 4000);
  }

  private showSuccess(msg: string): void {
    this.successMsg.set(msg);
    setTimeout(() => this.successMsg.set(""), 3500);
  }

  // Convert stored base64 to data URI for img src
  toDataUri(value: string): string {
    if (!value) return "";
    if (value.startsWith("data:")) return value;
    const mime = value.startsWith("/9j/") ? "image/jpeg" : "image/png";
    return `data:${mime};base64,${value}`;
  }
}
