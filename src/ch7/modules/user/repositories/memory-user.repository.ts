import { UserRepository } from "./user.repository.interface";
import { User } from "../dto/user.entity";

export class MemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  save(user: User) {
    const userId = user.getId();

    this.users.set(userId, user);
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }
}