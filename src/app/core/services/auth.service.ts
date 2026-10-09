import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  authState,
  User,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

/**
 * AuthService – Angular/Firebase equivalent of Firebase Auth usage
 * scattered across Flutter screens.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Observable of the current Firebase user (null when signed out) */
  readonly currentUser$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.currentUser$ = authState(this.auth);
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  // ─────────────────────────────────────────────────────────────
  // Sign up with email + password
  // ─────────────────────────────────────────────────────────────
  async signUpWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(
      this.auth,
      email.trim(),
      password.trim()
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Sign in with email + password
  // ─────────────────────────────────────────────────────────────
  async signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(
      this.auth,
      email.trim(),
      password.trim()
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Sign in with Google popup
  // ─────────────────────────────────────────────────────────────
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  // ─────────────────────────────────────────────────────────────
  // Sign out
  // ─────────────────────────────────────────────────────────────
  async signOut(): Promise<void> {
    return signOut(this.auth);
  }
}
