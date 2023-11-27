const { sub, startOfWeek, isWeekend } = require('date-fns');

function getPreviousWeekday(date: Date|string) {
    let previousDay = sub(date, { days: 4 });

    while (isWeekend(previousDay)) {
        previousDay = sub(previousDay, { days: 1 });
    }

    return previousDay;
}

export default getPreviousWeekday;