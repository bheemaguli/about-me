import { getMostActiveDay } from "./utils";

export function WeekdayStats({ data }: { data: Record<string, number> }) {
  // Order weekdays correctly
  const orderedDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const weekdayData = orderedDays.map((day) => ({
    day,
    count: data[day] || 0,
    shortDay: day.substring(0, 3),
  }));

  const maxValue = Math.max(...weekdayData.map((d) => d.count));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-4">
        {weekdayData.map(({ day, count, shortDay }) => {
          const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;

          return (
            <div key={day} className="flex flex-col items-center">
              <div className="bg-muted/20 relative h-40 w-full rounded-md">
                <div
                  className="bg-chart-5 absolute bottom-0 w-full rounded-md"
                  style={{ height: `${percentage}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                  {count}
                </div>
              </div>
              <div className="text-muted-foreground mt-2 text-sm">
                {shortDay}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm">
        Most active on {getMostActiveDay(weekdayData)}
      </p>
    </div>
  );
}
