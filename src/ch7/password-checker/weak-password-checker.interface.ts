export interface WeakPasswordChecker {
  checkPasswordWeak(password: string): boolean;
}