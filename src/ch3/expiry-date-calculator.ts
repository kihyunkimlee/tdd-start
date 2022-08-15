import dayjs from "dayjs";

/**
 * calculateExpiryDate method parameter
 */
export interface PayData {
  firstBillingDate?: dayjs.Dayjs;
  billingDate: dayjs.Dayjs;
  payment: number;
}


export class ExpiryDateCalculator {

  /**
   * 납부액 기준으로 서비스 만료일을 계산합니다.
   * @param payData
   */
  calculateExpiryDate(payData: PayData): dayjs.Dayjs {
    const { firstBillingDate, billingDate, payment } = payData;

    const addedMonths = 12 * Math.floor(payment / 100000) + (payment % 100000) / 10000;

    if (firstBillingDate) {
      return this.calculateExpiryDateWithFirstBillingDate(firstBillingDate, billingDate, addedMonths);
    } else {
      return billingDate.add(addedMonths, 'month');
    }
  }

  private calculateExpiryDateWithFirstBillingDate(firstBillingDate: dayjs.Dayjs, billingDate: dayjs.Dayjs, addedMonths: number): dayjs.Dayjs {
    const candidateExp = billingDate.add(addedMonths, 'month');
    if (!this.isSameDayOfMonth(firstBillingDate, candidateExp)) {
      const dayLenOfCandidate = this.lastDayOfMonth(candidateExp);
      const dayOfFirstBillingDate = firstBillingDate.date();
      if (dayLenOfCandidate < dayOfFirstBillingDate) {
        return candidateExp.set('date', dayLenOfCandidate);
      }
      return candidateExp.set('date', dayOfFirstBillingDate);
    }

    return candidateExp;
  }

  /**
   * date1 parameter 의 일자와 date2 parameter 의 일자가 같은지 여부를 반환합니다.
   * @param date1
   * @param date2
   * @private
   */
  private isSameDayOfMonth(date1: dayjs.Dayjs, date2: dayjs.Dayjs): boolean {
    return date1.date() == date2.date();
  }

  /**
   * date parameter 에 해당하는 날짜의 달의 가장 마지막 일자를 반환합니다.
   * @param date
   * @private
   */
  private lastDayOfMonth(date: dayjs.Dayjs): number {
    return date.daysInMonth();
  }
}