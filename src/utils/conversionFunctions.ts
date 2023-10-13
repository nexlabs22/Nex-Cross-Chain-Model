
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

export {convertTo13DigitsTimestamp}