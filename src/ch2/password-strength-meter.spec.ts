import {PasswordStrength, PasswordStrengthMeter} from "./password-strength-meter";

describe('PasswordStrengthMeter', () => {
  let meter: PasswordStrengthMeter;

  beforeEach(() => {
    meter = new PasswordStrengthMeter();
  });

  /**
   * password 파라미터의 암호 강도를 구하고 그 값이 expectedStrength 파라미터와 같은지를 테스트한다.
   * @param password
   * @param expectedStrength
   */
  const assertStrength = (password: string | null, expectedStrength: PasswordStrength) => {
    const result: PasswordStrength = meter.meter(password);

    expect(result).toBe(expectedStrength);
  }

  it('should be defined', () => {
    expect(meter).toBeDefined();
  });

  it('If the password meets all the criteria then the strength should be strong', () => {
    assertStrength('ab12!@AB', PasswordStrength.STRONG);

    assertStrength('abc1!Add', PasswordStrength.STRONG);
  });

  it('If the password meets other criteria except for length then the strength should be normal', () => {
    assertStrength('ab12!@A', PasswordStrength.NORMAL);
  });

  it('If the password meets other criteria except for number then the strength should be normal', () => {
    assertStrength('ab!@Abqwer', PasswordStrength.NORMAL)
  });

  it('If the password is null then the strength should be invalid', () => {
    assertStrength(null, PasswordStrength.INVALID);
  });

  it('If the password is empty then the strength should be invalid', () => {
    assertStrength('', PasswordStrength.INVALID);
  });

  it('If the password meets other criteria except for upper case then the strength should be normal', () => {
    assertStrength('ab12!@df', PasswordStrength.NORMAL);
  });

  it('If the password meets only length criteria then the strength should be weak', () => {
    assertStrength('abdefghi', PasswordStrength.WEAK);
  });

  it('If the password meets only number criteria then the strength should be weak', () => {
    assertStrength('12345', PasswordStrength.WEAK);
  });

  it('If the password meets only upper case criteria then the strength should be weak', () => {
    assertStrength('ABZEF', PasswordStrength.WEAK);
  });

  it(`If the password doesn't meet any criteria then the strength should be weak`, () => {
    assertStrength('abc', PasswordStrength.WEAK);
  });
});