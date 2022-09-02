import { EmailNotifier } from "./email-notifier";

export class SpyEmailNotifier implements EmailNotifier {
  private called: boolean = false;
  private email: string | null = null;

  isCalled(): boolean {
    return this.called;
  }

  getEmail(): string | null {
    return this.email;
  }

  sendRegisterEmail(email: string): void {
    this.called = true;
    this.email = email;
  }
}