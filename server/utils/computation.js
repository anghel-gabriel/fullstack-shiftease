export function calculateProfit(startTime, endTime, hourlyWage) {
  const timeDifference = endTime.getTime() - startTime.getTime();
  const workedHours = timeDifference / (1000 * 60 * 60);
  return hourlyWage * workedHours;
}
