# DENO_CRON

A smart cron Job scheduler library for Deno. It allows you to write human readable cron syntax with tons of flexibility. Writing cron syntax and operation can be very tadious for many developers. This extensions provides very developer friendly api to write any job scheduler's cron syntax you need.



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
```

## APIs:


