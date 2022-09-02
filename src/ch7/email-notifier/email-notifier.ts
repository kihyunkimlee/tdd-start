export interface EmailNotifier {
  sendRegisterEmail(email: string): void;
}