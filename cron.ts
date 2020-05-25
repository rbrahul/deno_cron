type JobType = () => void;

enum TIME_PART {
    SECOND = 'SECOND',
    MINUTE = 'MINUTE',
    HOUR = 'HOUR',
    DAY_OF_WEEK = 'DAY_OF_WEEK',
    DAY_OF_MONTH = 'DAY_OF_MONTH',
    MONTH = 'MONTH',
}

const schedules = new Map<string, Array<JobType>>();

let schedulerTimeIntervalID: ReturnType<typeof setInterval> = 0;
let shouldStopRunningScheduler = false;

export const cron = (schedule: string = '', job: JobType) => {
    let jobs = schedules.has(schedule)
        ? [...(schedules.get(schedule) || []), job]
        : [job];
    schedules.set(schedule, jobs);
};

const isRange = (text: string) => /^\d\d?\-\d\d?$/.test(text);

const getRange = (min: number, max: number) => {
    const numRange = [];
    let lowerBound = min;
    while (lowerBound <= max) {
        numRange.push(lowerBound);
        lowerBound += 1;
    }
    return numRange;
};

const { DAY_OF_MONTH, DAY_OF_WEEK, HOUR, MINUTE, MONTH, SECOND } = TIME_PART;

const getTimePart = (date: Date, type: TIME_PART): number =>
    ({
        [SECOND]: date.getSeconds(),
        [MINUTE]: date.getMinutes(),
        [HOUR]: date.getHours(),
        [MONTH]: date.getMonth() + 1,
        [DAY_OF_WEEK]: date.getDay(),
        [DAY_OF_MONTH]: date.getDate(),
    }[type]);

const isMatched = (date: Date, timeFlag: string, type: TIME_PART): boolean => {
    const timePart = getTimePart(date, type);

    if (timeFlag === '*') {
        return true;
    } else if (Number(timeFlag) === timePart) {
        return true;
    } else if (timeFlag.includes('/')) {
        const [_, executeAt = '1'] = timeFlag.split('/');
        return timePart % Number(executeAt) === 0;
    } else if (timeFlag.includes(',')) {
        const list = timeFlag.split(',').map((num: string) => parseInt(num));
        return list.includes(timePart);
    } else if (isRange(timeFlag)) {
        const [start, end] = timeFlag.split('-');
        const list = getRange(parseInt(start), parseInt(end));
        return list.includes(timePart);
    }
    return false;
};

export const validate = (schedule: string, date: Date = new Date()) => {
    // @ts-ignore
    const timeObj: Record<TIME_PART, boolean> = {};

    const [
        dayOfWeek,
        month,
        dayOfMonth,
        hour,
        minute,
        second = '01',
    ] = schedule.split(' ').reverse();

    const cronValues = {
        [SECOND]: second,
        [MINUTE]: minute,
        [HOUR]: hour,
        [MONTH]: month,
        [DAY_OF_WEEK]: dayOfWeek,
        [DAY_OF_MONTH]: dayOfMonth,
    };

    for (const key in cronValues) {
        timeObj[key as TIME_PART] = isMatched(
            date,
            cronValues[key as TIME_PART],
            key as TIME_PART,
        );
    }

    const didMatch = Object.values(timeObj).every(Boolean);
    return {
        didMatch,
        entries: timeObj,
    };
};

const executeJobs = () => {
    const date = new Date();
    schedules.forEach((jobs, schedule) => {
        if (validate(schedule, date).didMatch) {
            jobs.forEach((job) => job());
        }
    });
};

const runScheduler = () => {
    schedulerTimeIntervalID = setInterval(() => {
        if (shouldStopRunningScheduler) {
            clearInterval(schedulerTimeIntervalID);
            return;
        }
        executeJobs();
    }, 1000);
};

export const everyMinute = (cb: JobType) => {
    cron(`1 * * * * *`, cb);
};

export const every15Minute = (cb: JobType) => {
    cron(`1 */15 * * * *`, cb);
};

export const hourly = (cb: JobType) => {
    cron(`1 0 * * * *`, cb);
};

export const daily = (cb: JobType) => {
    cron(`1 0 0 * * *`, cb);
};

export const weekly = (cb: JobType, weekDay: string | number = 1) => {
    cron(`1 0 0 * * ${weekDay}`, cb);
};

export const biweekly = (cb: JobType) => {
    cron(`1 0 0 */14 * *`, cb);
};

export const monthly = (cb: JobType, dayOfMonth: string | number = 1) => {
    cron(`1 0 0 ${dayOfMonth} */1 *`, cb);
};

export const yearly = (cb: JobType) => {
    cron(`1 0 0 1 1 *`, cb);
};

export const start = () => {
    if (shouldStopRunningScheduler) {
        shouldStopRunningScheduler = false;
        runScheduler();
    }
};

export const stop = () => {
    shouldStopRunningScheduler = true;
};

runScheduler();
