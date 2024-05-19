const calculateProfit = (startTime, endTime, hourlyWage) => {
  const timeDifference = endTime.getTime() - startTime.getTime();
  const workedHours = timeDifference / (1000 * 60 * 60);
  return hourlyWage * workedHours;
};

export function isDateBefore(firstDate, secondDate) {
  return new Date(firstDate) < new Date(secondDate);
}

export default { calculateProfit, isDateBefore };
