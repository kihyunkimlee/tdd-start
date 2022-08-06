/**
 * 암호 강도
 */
export enum PasswordStrength {
  STRONG = 'STRONG',
  NORMAL = 'NORMAL',
  WEAK = 'WEAK',
  INVALID = 'INVALID',
}

export class PasswordStrengthMeter {

  /**
   * password 파라미터의 암호 강도를 계산해서 반환한다.
   * @param password
   */
  meter(password: string | null): PasswordStrength {
    if (!password) {
      return PasswordStrength.INVALID;
    }

    const metCounts = this.getMetCriteriaCounts(password);

    if (metCounts <= 1) return PasswordStrength.WEAK;
    if (metCounts == 2) return PasswordStrength.NORMAL;

    return PasswordStrength.STRONG;
  }

  /**
   * password 파라미터가 만족하는 암호 생성 규책 개수를 반환한다.
   * @param password
   */
  getMetCriteriaCounts(password: string): number {
    let metCounts = 0;

    if (password.length >= 8) metCounts++;
    if (/\d/.test(password)) metCounts++;
    if (/[A-Z]/.test(password)) metCounts++;

    return metCounts;
  }
}