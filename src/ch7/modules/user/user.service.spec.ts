import { UserService } from "./user.service";
import { StubPasswordChecker } from "../../password-checker/stub-password-checker";
import { WeakPasswordException } from "../../password-checker/weak-password.exception";
import { MemoryUserRepository } from "./repositories/memory-user.repository";
import { User } from "./dto/user.entity";
import { DuplicatedIdException } from "./repositories/duplicated-id.exception";
import {SpyEmailNotifier} from "../../email-notifier/spy-email-notifier";

describe('UserService', () => {
  describe('register', () => {
    let userService: UserService;
    let stubPasswordChecker: StubPasswordChecker;
    let fakeRepository: MemoryUserRepository;
    let spyEmailNotifier: SpyEmailNotifier;

    beforeEach(() => {
      stubPasswordChecker = new StubPasswordChecker();
      fakeRepository = new MemoryUserRepository();
      spyEmailNotifier = new SpyEmailNotifier();
      userService = new UserService(stubPasswordChecker, fakeRepository, spyEmailNotifier);
    });

    it('암호의 강도가 약하면 WeakPasswordException 에러를 던져야 한다.', () => {
      stubPasswordChecker.setWeak(true);

      expect(() => userService.register('id', 'pw', 'email')).toThrowError(WeakPasswordException)
    });

    it('동일한 ID 를 가진 사용자가 존재하는 경우 DuplicatedIdException 에러를 던져야 한다.', () => {
      const id  = 'id';
      const password = 'pw1';
      const email = 'test1@email.com';

      fakeRepository.save(new User(id, password, email));

      expect(() => userService.register(id, password, email)).toThrowError(DuplicatedIdException);
    });

    it('동일한 ID 를 가진 사용자가 없으면 가입에 성공해야 한다.', () => {
      const id  = 'id';
      const password = 'pw1';
      const email = 'test1@email.com';

      userService.register(id, password, email);

      const user = fakeRepository.findById(id);
      expect(user).toBeDefined();
      expect(user?.getId()).toBe(id);
      expect(user?.getPassword()).toBe(password);
      expect(user?.getEmail()).toBe(email);
    });

    it('가입에 성공하면 이메일을 발송해야 한다.', () => {
      const id  = 'id';
      const password = 'pw1';
      const email = 'test1@email.com';

      userService.register(id, password, email);

      expect(spyEmailNotifier.isCalled()).toBe(true);
      expect(spyEmailNotifier.getEmail()).toBe(email);
    });
  });
});