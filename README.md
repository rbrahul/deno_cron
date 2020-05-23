# DENO_CRON

A smart cron Job scheduler library for Deno. It allows you to write human readable cron syntax with tons of flexibility. Writing cron syntax and operation can be very tadious for many developers. This extensions provides very developer friendly api to write any job scheduler's cron syntax you need.

![Deno Cron](https://raw.githubusercontent.com/rbrahul/deno_cron/master/deno-cron-hd.png)


## Installation:

```javascript
import {cron, daily, monthly, weekly} from 'https://deno.land/x/deno_cron/cron.ts';

daily(() => {
    backupDatabase();
});


weekly(() => {
    sendNewsLetter();
});

// Runs the Job on 5th day of every month
monthly(() => {
    sendUsageReport();
}, 5);

// Run Job in every 30 minutes
cron('1 */30 * * * *', () => {
    checkStock();
});

```

## Writing CRON Job:

Here is the CRON style syntax to write tons of custom cron schedule.

```
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sunday)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59) - [Optional 01 as default]
```

### Syntax Table:

| Field        | Required           | Allowed Values  | Allowed Special Character |
| ------------- |:-------------:|:----------------------:|:------------------:|
| Seconds      | No | 0-59 | `/` `-` `,` `*` |
| Minute      | Yes      |   0-59 | `/` `-` `,` `*` |
| Hour | Yes     |    0-23 | `/` `-` `,` `*` |
| Day of Month | Yes     |    1-31 | `/` `-` `,` `*` |
| Month | Yes     |    1-12 | `/` `-` `,` `*` |
| Day of Week | Yes     |    0-6 (0 is Sunday) | `/` `-` `,` `*` |

#### Example:

```javascript
// This Job will be executed 1st day of every month at mid-night.
cron('1 0 0 1 */1 *', () => {
    sendMails();
});

// Job will be executed for 1st to 7th day of every month on 3rd, 6th and 9th hour and every 30 minutes if it's monday

cron('1 */30 3,6,9 1-7 */1 1', () => {
    sendMails();
});

```

## API:

| Function                    |                                Parameter        |
| ---------------------------- |:--------------------------------------------|
| `cron(schedule, job)`      |  **schedule: string** `required` - cron syntax, **job: func**  `required` - function to be executed|
| `everyMinute(job)`      |  **job: func** `required` - function to be executed |
| `every10Minute(job)`      |  **job: func** `required` - function to be executed |
| `hourly(job)`      |  **job: func** `required` - function to be executed |
| `daily(job)`      |  **job: func** `required` - function to be executed |
| `weekly(job, weekDay?)`      |  **job: func** `required` - function to be executed,  **weekDay: string** or **number** **{optional}** - Represents weekday; 0-6, (0 represents Sunday) `default:` **1** |
| `biweekly(job)`      |  **job: func** `required` - function to be executed |
| `monthly(job, dayOfMonth)`      |  **job: func** `required` - function to be executed, **dayOfMonth: string** or **number** **{optional}** -  1-31, `default:` **1** |
| `yearly(job)`      |  **job: func** **required** - function to be executed |


## Change Log:
* Initial version released on - 23-05-2020

## Contributors:

[Rahul Baruri](https://www.linkedin.com/in/rahul-baruri-23312311a/)

**Developed with ❤️ for Deno community**
