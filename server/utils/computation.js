const calculateProfit = (startTime, endTime, hourlyWage) => {
  const timeDifference = endTime.getTime() - startTime.getTime();
  const workedHours = timeDifference / (1000 * 60 * 60);
  return hourlyWage * workedHours;
};

export function isDateBefore(firstDate, secondDate) {
  return new Date(firstDate) < new Date(secondDate);
}

export const formatTimestamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default { calculateProfit, isDateBefore, formatTimestamp };
