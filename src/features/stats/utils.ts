export function formatLineCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toLocaleString();
}

export function formatHour(hour: number): string {
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}${ampm}`;
}

export function formatMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (year && month) {
    return `${shortMonths[Number.parseInt(month) - 1]} ${year.slice(2)}`;
  }
  return "";
}

export function getMostActiveDay(
  data: { day: string; count: number; shortDay: string }[],
): string {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  if (sorted[0]) {
    return sorted[0].day;
  }
  return "";
}
