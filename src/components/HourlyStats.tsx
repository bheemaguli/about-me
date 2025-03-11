import React from "react";

interface HourlyStatsProps {
  data: Record<string, number>;
}

export function HourlyStats({ data }: HourlyStatsProps) {
  // Create array of hourly data
  const hours = Array.from({ length: 24 }, (_, i) => i.toString());
  const hourlyData = hours.map((hour) => ({
    hour: parseInt(hour),
    count: data[hour] || 0,
  }));

  const maxValue = Math.max(...hourlyData.map((d) => d.count));

  return (
    <div className="space-y-4">
      <div className="flex h-64 items-end space-x-1">
        {hourlyData.map(({ hour, count }) => {
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
            <div key={hour} className="flex flex-1 flex-col items-center">
              <div
                className={`w-full ${colorClass} rounded-t`}
                style={{ height: `${percentage}%` }}
                title={`${count} commits at ${displayHour}`}
              />
              {hour % 3 === 0 && (
                <div className="mt-2 origin-left rotate-45 text-xs text-muted-foreground">
                  {displayHour}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center space-x-4">
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded-sm bg-chart-4" />
          <span className="text-xs">Morning (5AM-12PM)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded-sm bg-chart-2" />
          <span className="text-xs">Afternoon (12PM-6PM)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded-sm bg-chart-5" />
          <span className="text-xs">Evening (6PM-10PM)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded-sm bg-chart-3" />
          <span className="text-xs">Night (10PM-5AM)</span>
        </div>
      </div>
    </div>
  );
}

function formatHour(hour: number): string {
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}${ampm}`;
}
