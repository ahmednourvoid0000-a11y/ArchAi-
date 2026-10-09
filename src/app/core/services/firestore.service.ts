import { Injectable } from "@angular/core";
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "@angular/fire/firestore";
import { Auth } from "@angular/fire/auth";
import { Message } from "../../features/chat/models/message.model";

export interface ProjectDoc {
  id: string;
  name: string;
  prompt: string;
  result: string; // base64 image or text
  createdAt?: Date | null;
}

/**
 * FirestoreService – Angular/TypeScript rewrite of the Dart FirestoreService.
 *
 * Covers:
 *  - bot_chats sub-collection  (save / load / clear)
 *  - projects sub-collection   (get / delete)
 */
@Injectable({ providedIn: "root" })
export class FirestoreService {
  constructor(
    private firestore: Firestore,
    private auth: Auth,
  ) {}

  // ─── helpers ───────────────────────────────────────────────
  private get uid(): string {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    return uid;
  }

  private botChatsCol() {
    return collection(this.firestore, "users", this.uid, "bot_chats");
  }

  private projectsCol() {
    return collection(this.firestore, "users", this.uid, "projects");
  }

  // ─── bot_chats ─────────────────────────────────────────────
  async saveBotMessage(message: string, isUser: boolean): Promise<void> {
    await addDoc(this.botChatsCol(), {
      message,
      isUser,
      createdAt: serverTimestamp(),
    });
  }

  async loadBotMessages(): Promise<Message[]> {
    const q = query(this.botChatsCol(), orderBy("createdAt"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      text: d.data()["message"] as string,
      isUser: d.data()["isUser"] as boolean,
    }));
  }

  async clearBotChat(): Promise<void> {
    const snap = await getDocs(this.botChatsCol());
    const deletes = snap.docs.map((d) =>
      deleteDoc(doc(this.firestore, "users", this.uid, "bot_chats", d.id)),
    );
    await Promise.all(deletes);
  }

  // ─── projects ──────────────────────────────────────────────

  /** Return all projects ordered newest-first */
  async getProjects(): Promise<ProjectDoc[]> {
    const q = query(this.projectsCol(), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      name: (d.data()["name"] as string) ?? "AI Project",
      prompt: (d.data()["prompt"] as string) ?? "",
      result: (d.data()["result"] as string) ?? "",
      createdAt: (() => {
        const v = d.data()["createdAt"] as any;
        if (!v) return null;
        if (v.toDate && typeof v.toDate === "function") return v.toDate();
        if (v instanceof Date) return v;
        return null;
      })(),
    }));
  }

  /** Hard-delete a single project document */
  async deleteProject(projectId: string): Promise<void> {
    await deleteDoc(
      doc(this.firestore, "users", this.uid, "projects", projectId),
    );
  }
}
