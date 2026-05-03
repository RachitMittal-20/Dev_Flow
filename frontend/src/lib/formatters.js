const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric"
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric"
});

export function formatMonth(month) {
  const [year, monthIndex] = month.split("-");
  return monthFormatter.format(new Date(Number(year), Number(monthIndex) - 1, 1));
}

export function formatShortDate(dateString) {
  return shortDateFormatter.format(new Date(dateString));
}

export function formatDays(value) {
  return value.toFixed(2);
}

export function formatDaysLabel(value) {
  return `${value.toFixed(2)}d`;
}

export function formatPercentValue(value) {
  const percentage = value * 100;
  return Math.abs(percentage - Math.round(percentage)) < 0.05
    ? Math.round(percentage).toString()
    : percentage.toFixed(1);
}

export function formatPercentLabel(value) {
  return `${formatPercentValue(value)}%`;
}
