const { sub, startOfWeek, isWeekend } = require('date-fns');

function getPreviousWeekday(date: Date|string) {
    let previousDay = sub(date, { days: 4 });

    while (isWeekend(previousDay)) {
        previousDay = sub(previousDay, { days: 1 });
    }

    return previousDay;
}

function SwapNumbers(a: number, b: number): [number, number] {
    [a, b] = [b, a];
    return [a, b];
}

export { getPreviousWeekday, SwapNumbers};