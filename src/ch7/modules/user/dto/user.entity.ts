export class User {
  constructor(
    private readonly id: string,
    private readonly password: string,
    private readonly email: string,
  ) {}

  getId(): string {
    return this.id;
  }

  getPassword(): string {
    return this.password;
  }

  getEmail(): string {
    return this.email;
  }
}