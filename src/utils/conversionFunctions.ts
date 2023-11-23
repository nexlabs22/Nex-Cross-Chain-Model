
const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
    'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];

export default function getTooltipDate(timestamp: number){
    const humanDate = new Date(timestamp);
    const date = humanDate.getDate()
    const month = months[humanDate.getMonth()]
    const year = humanDate.getFullYear()

    return `${date} ${month}, ${year}`
}

function convertTo13DigitsTimestamp(timestamp:number): number{  
    if(timestamp.toString().length < 13){
        const numofzeros = 13 - timestamp.toString().length 
        return timestamp * Math.pow(10,numofzeros)
    }else{
        return timestamp
    }
}

function dateToEpoch(dateString: string): number {
    const dateObject = new Date(dateString);
    const epochTime = dateObject.getTime()/1000; // Convert to seconds (Unix timestamp)
    return epochTime;
}

function isSameDay(time1: number, time2: number){
  const time1Converted = new Date(convertTo13DigitsTimestamp(time1))
  const time2Converted = new Date(convertTo13DigitsTimestamp(time2))
    return (
      time1Converted.getFullYear() === time2Converted.getFullYear() &&
      time1Converted.getMonth() === time2Converted.getMonth() &&
      time1Converted.getDate() === time2Converted.getDate()
    );
  }
function isSameMonth(time1: number, time2: number){
    const time1Converted = new Date(convertTo13DigitsTimestamp(time1))
    const time2Converted = new Date(convertTo13DigitsTimestamp(time2))
    return (
      time1Converted.getFullYear() === time2Converted.getFullYear() &&
      time1Converted.getMonth() === time2Converted.getMonth()
    );
  }

function getTimestampDaysAgo(numberOfDays: number): number {
    const millisecondsInDay = 24 * 60 * 60 * 1000; 
    const timestampDaysAgo = Date.now() - numberOfDays * millisecondsInDay;
    return Math.floor(timestampDaysAgo / 1000); 
  };

export {convertTo13DigitsTimestamp, dateToEpoch, isSameDay,isSameMonth,getTimestampDaysAgo}