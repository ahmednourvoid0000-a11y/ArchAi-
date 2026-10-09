export class Validators {
  static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }
  static isValidPassword(password: string): boolean {
    return password.trim().length >= 6;
  }
}
