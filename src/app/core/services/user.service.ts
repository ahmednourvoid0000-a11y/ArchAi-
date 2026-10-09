import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { UserProfile } from '../models/user.model';

/**
 * UserService – Angular port of user_service.dart.
 *
 * The Dart original uses SharedPreferences (local storage) as the primary
 * store and Firestore only to persist to the cloud.
 *
 * Angular equivalent:
 *  - localStorage  mirrors SharedPreferences (same key names as Dart)
 *  - Firestore     cloud persistence (users/{uid} document)
 *  - In-memory cache for fast repeated reads
 *
 * Static method naming mirrors Dart exactly:
 *   saveUserData / getUserData / updateUserData / clearUserData
 *   isLoggedIn / getFirstName / getLastName / getEmail / getUid
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  // ── localStorage key names match Dart constants ──────────────
  private static readonly K_FIRST   = 'user_first_name';
  private static readonly K_LAST    = 'user_last_name';
  private static readonly K_EMAIL   = 'user_email';
  private static readonly K_UID     = 'user_uid';
  private static readonly K_LOGGED  = 'user_is_logged_in';

  private cachedUser: UserProfile | null = null;

  constructor(private firestore: Firestore) {}

  // ─────────────────────────────────────────────────────────────
  // saveUserData – mirrors Dart static saveUserData(...)
  // Writes to localStorage AND Firestore
  // ─────────────────────────────────────────────────────────────
  async saveUserData(profile: UserProfile): Promise<void> {
    // 1. localStorage (fast, immediate, survives refresh)
    localStorage.setItem(UserService.K_FIRST,  profile.firstName.trim());
    localStorage.setItem(UserService.K_LAST,   profile.lastName.trim());
    localStorage.setItem(UserService.K_EMAIL,  profile.email.trim());
    localStorage.setItem(UserService.K_UID,    profile.uid);
    localStorage.setItem(UserService.K_LOGGED, 'true');

    // 2. Firestore cloud persistence
    const ref = doc(this.firestore, 'users', profile.uid);
    await setDoc(ref, {
      firstName: profile.firstName.trim(),
      lastName:  profile.lastName.trim(),
      email:     profile.email.trim(),
      uid:       profile.uid,
    }, { merge: true });

    this.cachedUser = profile;
  }

  // ─────────────────────────────────────────────────────────────
  // getUserData – mirrors Dart static getUserData()
  // Returns cache → localStorage → Firestore (in that priority)
  // ─────────────────────────────────────────────────────────────
  async getUserData(uid: string): Promise<UserProfile> {
    if (this.cachedUser?.uid === uid) return this.cachedUser;

    // Try localStorage first (fast)
    const localFirst = localStorage.getItem(UserService.K_FIRST);
    if (localFirst && localStorage.getItem(UserService.K_UID) === uid) {
      const profile: UserProfile = {
        uid,
        firstName: localFirst,
        lastName:  localStorage.getItem(UserService.K_LAST)  ?? '',
        email:     localStorage.getItem(UserService.K_EMAIL) ?? '',
      };
      this.cachedUser = profile;
      return profile;
    }

    // Fall back to Firestore
    const ref  = doc(this.firestore, 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error(`No user doc for uid: ${uid}`);

    const data = snap.data() as UserProfile;
    this.cachedUser = data;

    // Back-fill localStorage
    localStorage.setItem(UserService.K_FIRST,  data.firstName);
    localStorage.setItem(UserService.K_LAST,   data.lastName);
    localStorage.setItem(UserService.K_EMAIL,  data.email);
    localStorage.setItem(UserService.K_UID,    data.uid);

    return data;
  }

  // ─────────────────────────────────────────────────────────────
  // updateUserData – mirrors Dart static updateUserData(...)
  // Updates firstName/lastName only (email not editable)
  // ─────────────────────────────────────────────────────────────
  async updateUserData(uid: string, firstName: string, lastName: string): Promise<void> {
    localStorage.setItem(UserService.K_FIRST, firstName.trim());
    localStorage.setItem(UserService.K_LAST,  lastName.trim());

    const ref = doc(this.firestore, 'users', uid);
    await updateDoc(ref, { firstName: firstName.trim(), lastName: lastName.trim() });

    if (this.cachedUser) {
      this.cachedUser = { ...this.cachedUser, firstName: firstName.trim(), lastName: lastName.trim() };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Convenience getters – mirror Dart static getters
  // ─────────────────────────────────────────────────────────────
  getFirstName(): string { return localStorage.getItem(UserService.K_FIRST) ?? 'User'; }
  getLastName():  string { return localStorage.getItem(UserService.K_LAST)  ?? 'Name'; }
  getEmail():     string { return localStorage.getItem(UserService.K_EMAIL) ?? 'user@example.com'; }
  getUid():       string | null { return localStorage.getItem(UserService.K_UID); }
  isLoggedIn():   boolean { return localStorage.getItem(UserService.K_LOGGED) === 'true'; }

  // ─────────────────────────────────────────────────────────────
  // clearUserData – mirrors Dart static clearUserData()
  // ─────────────────────────────────────────────────────────────
  clearUserData(): void {
    localStorage.removeItem(UserService.K_FIRST);
    localStorage.removeItem(UserService.K_LAST);
    localStorage.removeItem(UserService.K_EMAIL);
    localStorage.removeItem(UserService.K_UID);
    localStorage.removeItem(UserService.K_LOGGED);
    this.cachedUser = null;
  }
}
