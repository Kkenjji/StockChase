function getDateFor(interval) {
  var startDate = getCurrDate();
  var endDate = getCurrDate();

  switch (interval) {
    case 'quarterly': // past 3 years
      startDate.setFullYear(endDate.getFullYear() - 3); 
      startDate.setMonth(endDate.getMonth() - endDate.getMonth() % 3);
      endDate.setMonth(endDate.getMonth() - endDate.getMonth() % 3 - 1);
      break;
    case 'monthly': // past year
      startDate.setFullYear(endDate.getFullYear() - 1);
      endDate.setMonth(endDate.getMonth() - 1);
      break;
    case 'weekly': // past 3 months
      endDate.setDate(findLatestSunday(endDate).getDate());
      startDate.setDate(endDate.getDate() - 12 * 7 + 1);
      break;
  }

  return {
    startDate: startDate,
    endDate: endDate,
    interval: interval
  };
  // return "StartDate: " + startDate + " and EndDate: " + endDate + " Interval: " + interval;
}

function getCurrDate() {
  return new Date();
}

function findLatestSunday(date) {
  while (date.getDay() !== 0) {
    date.setDate(date.getDate() - 1);
  }
  return date;
}
