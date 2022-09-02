import { WeakPasswordChecker } from "./weak-password-checker.interface";

export class StubPasswordChecker implements WeakPasswordChecker {
  private weak: boolean = false;

  setWeak(weak: boolean) {
    this.weak = weak;
  }

  checkPasswordWeak(password: string): boolean {
    return this.weak;
  }
}