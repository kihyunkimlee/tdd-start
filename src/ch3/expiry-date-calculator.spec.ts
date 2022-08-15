import dayjs from 'dayjs';
import { ExpiryDateCalculator, PayData } from "./expiry-date-calculator";

describe('ExpiryDateCalculator', () => {
  let calculator: ExpiryDateCalculator;

  beforeEach(() => {
    calculator = new ExpiryDateCalculator();
  });

  /**
   * 만료일을 계산해서 예상 만료일과 같은지 비교한다.
   * @param payData
   * @param expectedExpiryDate
   */
  const assertExpiryDate = (payData: PayData, expectedExpiryDate: dayjs.Dayjs) => {
    const expiryDate = calculator.calculateExpiryDate(payData);

    expect(expiryDate).toEqual(expectedExpiryDate);
  }

  it('납부액이 1만 원이면 만료일은 납부일의 한 달 뒤여야 한다.', () => {
    assertExpiryDate({ billingDate: dayjs('2022-08-01'), payment: 10000 }, dayjs('2022-09-01'));
    assertExpiryDate({ billingDate: dayjs('2022-07-15'), payment: 10000 }, dayjs('2022-08-15'));
  });

  it('납부한 달의 일수가 만료될 달의 일수 보다 더 많은 경우 납부액이 1만 원이면 만료일은 다음달 가장 마지막 일이어야 한다.', () => {
    assertExpiryDate({ billingDate: dayjs('2022-01-31'), payment: 10000 }, dayjs('2022-02-28'));
    assertExpiryDate({ billingDate: dayjs('2022-05-31'), payment: 10000 }, dayjs('2022-06-30'));
  });

  it('처음으로 납부한 달의 일수와 재 납부한 달의 일수가 다른 경우 납부액이 1만 원이면 만료될 달은 재 납부일의 한 달 뒤, 그리고 만료일은 처음 납부일을 기준으로 결정되어야 한다.', () => {
    assertExpiryDate({ firstBillingDate: dayjs('2022-01-31'), billingDate: dayjs('2022-02-28'), payment: 10000 }, dayjs('2022-03-31'));
    assertExpiryDate({ firstBillingDate: dayjs('2022-01-30'), billingDate: dayjs('2022-02-28'), payment: 10000 }, dayjs('2022-03-30'));
    assertExpiryDate({ firstBillingDate: dayjs('2022-05-31'), billingDate: dayjs('2022-06-30'), payment: 10000 }, dayjs('2022-07-31'));
  });

  it('납부액이 2만원 이상이면 만료일은 납부 금액에 비례해서 결정된다.', () => {
    assertExpiryDate({ billingDate: dayjs('2022-03-01'), payment: 20000 }, dayjs('2022-05-01'));
    assertExpiryDate({ billingDate: dayjs('2022-03-01'), payment: 30000 }, dayjs('2022-06-01'));
    assertExpiryDate({ billingDate: dayjs('2022-03-01'), payment: 50000 }, dayjs('2022-08-01'));
    assertExpiryDate({ billingDate: dayjs('2022-03-01'), payment: 90000 }, dayjs('2022-12-01'));
  });

  it('처음으로 납부한 달의 일수와 재 납부한 달의 일수가 다른 경우 납부액이 2만원 이상이면 만료될 달은 금액에 비례해서 결정되고, 만료될 일은 처음 납부일을 기준으로 결정되어야 한다.', () => {
    assertExpiryDate({ firstBillingDate: dayjs('2022-01-31'), billingDate: dayjs('2022-02-28'), payment: 30000 }, dayjs('2022-05-31'));
    assertExpiryDate({ firstBillingDate: dayjs('2022-01-31'), billingDate: dayjs('2022-02-28'), payment: 20000 }, dayjs('2022-04-30'));
  });

  it('10만원 납부하면 만료일은 1년 뒤여야 한다.', () => {
    assertExpiryDate({ billingDate: dayjs('2022-03-01'), payment: 100000 }, dayjs('2023-03-01'));
    assertExpiryDate({ billingDate: dayjs('2020-02-29'), payment: 100000 }, dayjs('2021-02-28'))
  });

  it('13만원 납부하면 만료일은 1년 3개월 뒤여야 한다.', () => {
    assertExpiryDate({billingDate: dayjs('2022-03-01'), payment: 130000 }, dayjs('2023-06-01'));
  });

  it('23만원 납부하면 만료일은 2년 3개월 뒤여야 한다.', () => {
    assertExpiryDate({billingDate: dayjs('2022-03-01'), payment: 230000 }, dayjs('2024-06-01'));
  });
});