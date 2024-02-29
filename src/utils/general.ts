const { sub, startOfWeek, isWeekend } = require('date-fns');

function getPreviousWeekday(date: Date|string) {
    let previousDay = sub(date, { days: 10 });

    while (isWeekend(previousDay)) {
        previousDay = sub(previousDay, { days: 1 });
    }

    return previousDay;
}

function SwapNumbers(a: number, b: number): [number, number] {
    [a, b] = [b, a];
    return [a, b];
}

function reduceAddress(address:string){
    return address.toString().slice(0, 7) + '...' + address.toString().substring(address.toString().length - 7)
}

function convertTime(timestamp: number) {
    const date = new Date(timestamp * 1000)
    const localDate = date.toLocaleDateString('en-US')
    const localTime = date.toLocaleTimeString('en-US')
    return localDate + ' ' + localTime
}

export { getPreviousWeekday, SwapNumbers, reduceAddress, convertTime};