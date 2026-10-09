import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  limit,
  deleteDoc,
  doc,
} from "@angular/fire/firestore";
import { Auth } from "@angular/fire/auth";
import { environment } from "../../../environments/environment";

export interface DesignProject {
  id?: string;
  name: string;
  prompt: string;
  result: string;
  createdAt?: Date;
}

@Injectable({ providedIn: "root" })
export class DesignService {
  private get baseUrl(): string {
    return environment.designBaseUrl ?? "";
  }

  constructor(
    private http: HttpClient,
    private firestore: Firestore,
    private auth: Auth,
  ) {}

  async generateImage(prompt: string): Promise<string | null> {
    const url = `${this.baseUrl}/generate`;
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const body = {
      prompt,
      negative_prompt:
        "blurry, low quality, distorted layout, warped walls, extra rooms, duplicate doors, messy lines, bad anatomy, cropped, watermark, text noise",
      steps: 20,
      guidance: 4,
      seed: 4268,
      width: 768,
      height: 768,
    };
    try {
      const res = await firstValueFrom(
        this.http.post<{ item: { image_base64: string } }>(url, body, {
          headers,
        }),
      );
      return res?.item?.image_base64 ?? null;
    } catch (e) {
      console.error("IMAGE AI ERROR:", e);
      return null;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.get<unknown>(`${this.baseUrl}/health`),
      );
      return !!res;
    } catch {
      return false;
    }
  }

  async createProject(project: Omit<DesignProject, "id">): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    const ref = collection(this.firestore, "users", uid, "projects");
    await addDoc(ref, { ...project, createdAt: serverTimestamp() });
  }

  // Delete the most recently created project for the current user.
  // Returns true if a project was deleted, false if none existed.
  async deleteLatestProject(): Promise<boolean> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return false;
    const ref = collection(this.firestore, "users", uid, "projects");
    const q = query(ref, orderBy("createdAt", "desc"), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return false;
    await deleteDoc(snap.docs[0].ref);
    return true;
  }

  async saveDesignMessage(
    text: string,
    isUser: boolean,
    isPreview = false,
  ): Promise<string | null> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return null;
    const ref = collection(this.firestore, "users", uid, "design_chats");
    const docRef = await addDoc(ref, {
      message: text,
      isUser,
      isPreview,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async loadDesignMessages(): Promise<
    {
      id: string;
      text: string;
      isUser: boolean;
      isPreview: boolean;
      createdAt?: Date | null;
    }[]
  > {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return [];
    const ref = collection(this.firestore, "users", uid, "design_chats");
    const snap = await getDocs(query(ref, orderBy("createdAt")));
    return snap.docs.map((d) => ({
      id: d.id,
      text: d.data()["message"] as string,
      isUser: d.data()["isUser"] as boolean,
      isPreview: (d.data()["isPreview"] as boolean) ?? false,
      createdAt:
        (d.data()["createdAt"] &&
          (d.data()["createdAt"].toDate
            ? d.data()["createdAt"].toDate()
            : d.data()["createdAt"])) ??
        null,
    }));
  }

  // Remove all persisted design chat messages for the current user
  async clearDesignMessages(): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    const ref = collection(this.firestore, "users", uid, "design_chats");
    const snap = await getDocs(ref);
    const deletes = snap.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletes);
  }

  async deleteDesignMessage(messageId: string): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    await deleteDoc(
      doc(this.firestore, "users", uid, "design_chats", messageId),
    );
  }
}
