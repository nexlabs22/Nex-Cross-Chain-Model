import { BigNumber } from "alchemy-sdk";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export default function getTooltipDate(timestamp: number) {
  const humanDate = new Date(timestamp);
  const date = humanDate.getDate();
  const month = months[humanDate.getMonth()];
  const year = humanDate.getFullYear();

  return `${date} ${month}, ${year}`;
}

function convertTo13DigitsTimestamp(timestamp: number): number {
  if (timestamp.toString().length < 13) {
    const numofzeros = 13 - timestamp.toString().length;
    return timestamp * Math.pow(10, numofzeros);
  } else {
    return timestamp;
  }
}

function dateToEpoch(dateString: string): number {
  const dateObject = new Date(dateString);
  const epochTime = dateObject.getTime() / 1000; // Convert to seconds (Unix timestamp)
  return epochTime;
}

function isSameDay(time1: number, time2: number) {
  const time1Converted = new Date(convertTo13DigitsTimestamp(time1));
  const time2Converted = new Date(convertTo13DigitsTimestamp(time2));
  return (
    time1Converted.getFullYear() === time2Converted.getFullYear() &&
    time1Converted.getMonth() === time2Converted.getMonth() &&
    time1Converted.getDate() === time2Converted.getDate()
  );
}
function isSameMonth(time1: number, time2: number) {
  const time1Converted = new Date(convertTo13DigitsTimestamp(time1));
  const time2Converted = new Date(convertTo13DigitsTimestamp(time2));
  return (
    time1Converted.getFullYear() === time2Converted.getFullYear() &&
    time1Converted.getMonth() === time2Converted.getMonth()
  );
}

function getTimestampDaysAgo(numberOfDays: number): number {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const timestampDaysAgo = Date.now() - numberOfDays * millisecondsInDay;
  return Math.floor(timestampDaysAgo / 1000);
}

export const num = (value: string | BigNumber | unknown) =>
  Number(value) / 1e18;
export const weiToNum = (
  value: string | BigNumber | unknown,
  decimals: number
) => Number(value) / 10 ** decimals;
export const numToWei = (
  value: string | BigNumber | unknown,
  decimals: number
) => Number(value) * 10 ** decimals;

function formatAsString(value: number): string {
  let result;
  const checkValue = Math.abs(value);

  // if (checkValue < 0.01) result = checkValue.toFixed(Math.max(0, -Math.floor(Math.log10(checkValue)) || 0) )
  // else if (checkValue < 100) result = checkValue.toFixed(2)
  if (checkValue < 100) result = checkValue.toFixed(2);
  else if (checkValue <= 1000) result = checkValue.toFixed(2);
  else if (checkValue < 10_000)
    result = Number(checkValue.toFixed(2)).toLocaleString("en-US");
  else if (checkValue < 1_000_000)
    result = (checkValue / 1000).toFixed(2) + "K";
  else if (checkValue < 1_000_000_000)
    result = (checkValue / 1_000_000).toFixed(2) + "Mil.";
  else if (checkValue < 1_000_000_000_000)
    result = (checkValue / 1_000_000_000).toFixed(2) + "B.";
  else if (checkValue < 1_000_000_000_000_000)
    result = (checkValue / 1_000_000_000_000).toFixed(2) + "T.";
  else result = checkValue.toExponential(2);
  return result;
}

function formatAsNumber(value: number): number {
  let result: number;
  const checkValue = Math.abs(value);

  if (checkValue < 0.0001) result = checkValue;
  else if (checkValue < 2) result = Number(checkValue.toFixed(4));
  else if (checkValue <= 1000) result = Number(checkValue.toFixed(2));
  else if (checkValue <= 10_000) result = Number(checkValue.toFixed(0));
  // else result = Number((checkValue / 1000).toFixed(0));
  else result = checkValue;
  return result;
}

function formatAsPercent(value: number): string {
  return value.toFixed(2) + "%";
}

function formatAsCurrency(value: number): string {
  return Math.abs((value * 100) / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatToViewNumber({
  value,
  returnType = "string",
}: {
  value: number;
  returnType?: "string" | "number" | "percent" | "currency";
}) {
  if (!value || typeof value !== "number")
    return returnType === "percent" ? value + "%" : value;

  switch (returnType) {
    case "string":
      return formatAsString(value);
    case "number":
      return formatAsNumber(value);
    case "percent":
      return formatAsPercent(value);
    case "currency":
      return formatAsCurrency(value);
    default:
      return value;
  }
}

export function formatNumber(input: number): string {
  if (input >= 1) {
    return input.toFixed(2);
  } else {
    const decimalCount = Math.max(0, -Math.floor(Math.log10(input)) || 0) + 1;
    return input.toFixed(
      !!decimalCount && decimalCount > 1 && decimalCount < 100
        ? decimalCount
        : 2
    );
  }
}

export {
  convertTo13DigitsTimestamp,
  dateToEpoch,
  isSameDay,
  isSameMonth,
  getTimestampDaysAgo,
  formatToViewNumber,
};
