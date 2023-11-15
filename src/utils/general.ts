const { sub, startOfWeek, isWeekend } = require('date-fns');

function getPreviousWeekday(date: Date|string) {
    let previousDay = sub(date, { days: 2 });

    while (isWeekend(previousDay)) {
        previousDay = sub(previousDay, { days: 1 });
    }

    return previousDay;
}

export default getPreviousWeekday;