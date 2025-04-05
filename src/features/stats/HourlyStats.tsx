import type { Hourlyactivity } from "./types";
import { formatHour } from "./utils";

export function HourlyStats({ data }: { data: Hourlyactivity }) {
  // Create array of hourly data in IST
  const localHourlyData = Object.keys(data).map((hour) => ({
    hour: (Number.parseInt(hour) + 5.5) % 24,
    count: data[hour] || 0,
  }));
  // Lets set key to rounded hour and average count of 2 hours
  const roundedHourlyData = localHourlyData.map((d) => ({
    hour: Math.round(d.hour),
    count: d.count / 2,
  }));

  const maxValue = Math.max(...roundedHourlyData.map((d) => d.count));

  return (
    <div className="space-y-4">
      <div className="flex h-64 items-end space-x-1">
        {roundedHourlyData.map(({ hour, count }) => {
          const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
          const displayHour = formatHour(hour);

          // Determine color based on time of day
          let colorClass = "bg-chart-1";
          if (hour >= 5 && hour < 12)
            colorClass = "bg-chart-4"; // Morning
          else if (hour >= 12 && hour < 18)
            colorClass = "bg-chart-2"; // Afternoon
          else if (hour >= 18 && hour < 22)
            colorClass = "bg-chart-5"; // Evening
          else colorClass = "bg-chart-3"; // Night

          return (
            <div
              key={hour}
              className="relative flex h-full flex-1 flex-col items-center justify-end pt-10"
            >
              <div
                className={`w-full ${colorClass} rounded-t`}
                style={{ height: `${percentage}%` }}
                title={`${count} commits at ${displayHour}`}
              />
              {hour % 3 === 0 && (
                <div className="text-muted-foreground absolute top-0 mt-2 origin-left rotate-45 text-xs">
                  {displayHour}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center space-x-4">
        <div className="flex items-center space-x-1">
          <div className="bg-chart-4 h-3 w-3 rounded-sm" />
          <span className="text-xs">Morning (5AM-12PM)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="bg-chart-2 h-3 w-3 rounded-sm" />
          <span className="text-xs">Afternoon (12PM-6PM)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="bg-chart-5 h-3 w-3 rounded-sm" />
          <span className="text-xs">Evening (6PM-10PM)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="bg-chart-3 h-3 w-3 rounded-sm" />
          <span className="text-xs">Night (10PM-5AM)</span>
        </div>
      </div>
    </div>
  );
}
