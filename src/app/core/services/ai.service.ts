import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AiService {
  private get baseUrl(): string {
    return environment.aiBaseUrl ?? '';
  }

  private history: unknown[] = [];

  constructor(private http: HttpClient) {}

  async sendMessage(message: string): Promise<void> {
    const url = `${this.baseUrl}/gradio_api/run/user_input`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    });
    const res = await firstValueFrom(
      this.http.post<{ data: unknown[] }>(url, { data: [message, this.history] }, { headers })
    );
    this.history = res.data[1] as unknown[];
  }

  async getResponse(): Promise<string> {
    const url = `${this.baseUrl}/gradio_api/run/bot_response`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    });
    const res = await firstValueFrom(
      this.http.post<{ data: unknown[] }>(url, { data: [this.history] }, { headers })
    );
    this.history = res.data[0] as unknown[];
    const messages = this.history as Array<{ content: string }>;
    return messages.at(-1)?.content ?? '';
  }

  async clearChat(): Promise<void> {
    const url = `${this.baseUrl}/gradio_api/run/lambda`;
    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });
    try {
      await firstValueFrom(this.http.post(url, {}, { headers }));
    } catch { /* non-fatal */ }
    this.history = [];
  }
}
