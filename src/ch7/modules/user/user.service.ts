import { WeakPasswordChecker } from "../../password-checker/weak-password-checker.interface";
import { WeakPasswordException } from "../../password-checker/weak-password.exception";
import { UserRepository } from "./repositories/user.repository.interface";
import { DuplicatedIdException } from "./repositories/duplicated-id.exception";
import { User } from "./dto/user.entity";
import { EmailNotifier } from "../../email-notifier/email-notifier";

export class UserService {

  constructor(
    private readonly passwordChecker: WeakPasswordChecker,
    private readonly userRepository: UserRepository,
    private readonly emailNotifier: EmailNotifier,
  ) {}

  register(id: string, password: string, email: string): void {
    if (this.passwordChecker.checkPasswordWeak(password)) {
      throw new WeakPasswordException();
    }

    const user = this.userRepository.findById(id);
    if (user) {
      throw new DuplicatedIdException();
    }
    this.userRepository.save(new User(id, password, email));

    this.emailNotifier.sendRegisterEmail(email);
  }
}