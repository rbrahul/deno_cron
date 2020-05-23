import { validate } from "./cron.ts";

const assert = (value1: any, value2: any) => {
  if (value1 !== value2) {
    console.error(
      "❌ Failed:\n + Expected: " + String(value2) + "\n - Received: " + String(value1)
    );
  } else {
      console.log('✅ success:')
  }
};

const test = (() => {
    let counter = 0;
    return (description: string) => (params: string, date: Date) => {
        console.log(`${++counter} - ${description}`);
        assert(validate(params, date).didMatch, true);
      }
})();


test('Should execute on 1st November Monday at 10 O\'clock, 5th minute and 6th second with range 1-6')('1-8 05 10 01 11 0',new Date('2020-11-01 10:05:06'))

test('Should execute on 1st November Monday at 10 O\'clock, 5th minute and 6th second with comma separated minute 1,3,5')('06 1,3,5 10 01 11 0',new Date('2020-11-01 10:05:06'))

test('Should execute on 4th February Thursday at 10 O\'clock, 7th minute and 6th second with comma separated minute 1,3,7 and */5 occurance')('1,3,7 */5 04 1-4 0,4',new Date('2021-02-04 10:07:06'));

test('Should execute on every week at monday mid night')("1 0 0 * * 1", new Date("2021-03-08 00:00:01"));

test('Should execute on every week at mid night')("1 0 0 * * 1", new Date("2021-01-04 00:00:01"));

test('Should execute on every year january 1 at midnight ')("1 0 0 * 1 *", new Date("2021-01-01 00:00:01"));

test('Should execute on every month at midnight ')("1 0 0 1 */1 *", new Date("2021-01-01 00:00:01"));

test('Should execute on bi-weekly at mid night')("1 0 0 */14 * *", new Date("2021-01-28 00:00:01"));

test('Should execute on daily at mid night')("0 0 * * *", new Date("2021-01-27 00:00:01"));

test('Should execute hourly at 1st second')("1 0 * * * *", new Date("2021-01-27 01:00:01"));

test('Should execute every minute at 1st second')("1 * * * * *", new Date("2021-01-27 01:01:01"));

test('Should execute every 15 minute at 1st second')("1 */15 * * * *", new Date("2021-01-27 03:45:01"));
