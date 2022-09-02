import { User } from "../dto/user.entity";

export interface UserRepository {
  save(user: User): void;

  findById(id: string): User | undefined;
}