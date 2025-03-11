import React from "react";
import { cn } from "@/lib/utils";

interface ContributionCalendarProps {
  data: Record<string, number>;
}

export function ContributionCalendar({ data }: ContributionCalendarProps) {
  // Get all dates sorted
  const dates = Object.keys(data).sort();

  // Find max contribution to normalize colors
  const maxContribution = Math.max(...Object.values(data));

  // Group dates by week for display
  const weeks: string[][] = [];
  let currentWeek: string[] = [];

  // Calculate the day of week for the first date (0 = Sunday, 6 = Saturday)
  const firstDate = new Date(dates[0]);
  const firstDayOfWeek = firstDate.getDay();

  // Add empty cells for the first week if needed
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push("");
  }

  // Group all dates into weeks
  dates.forEach((date) => {
    const day = new Date(date).getDay();

    // If it's a Sunday and we already have cells, start a new week
    if (day === 0 && currentWeek.length > 0) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }

    currentWeek.push(date);

    // If it's the last date, add the current week
    if (date === dates[dates.length - 1]) {
      // Fill remaining days in the last week
      const remainingDays = 7 - currentWeek.length;
      for (let i = 0; i < remainingDays; i++) {
        currentWeek.push("");
      }
      weeks.push([...currentWeek]);
    }
  });

  // Create month labels for top of calendar
  const monthLabels = generateMonthLabels(dates);

  return (
    <div className="space-y-3 overflow-auto">
      {/* Month labels */}
      <div className="flex pl-7 text-xs text-muted-foreground">
        {monthLabels.map((month, i) => (
          <div key={i} className="flex-1">
            {month}
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <div className="grid grid-flow-col grid-rows-7 gap-1 text-xs">
          {/* Day of week labels (side) */}
          <div className="row-span-1 pr-2 text-right text-muted-foreground">
            Mon
          </div>
          <div className="row-span-1 pr-2 text-right text-muted-foreground">
            Wed
          </div>
          <div className="row-span-1 pr-2 text-right text-muted-foreground">
            Fri
          </div>

          {/* Calendar grid */}
          {weeks.map((week, weekIdx) => (
            <React.Fragment key={weekIdx}>
              {week.map((date, dayIdx) => {
                const contributions = date ? data[date] || 0 : 0;
                const level = getContributionLevel(
                  contributions,
                  maxContribution,
                );

                return (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    className={cn(
                      "h-3 w-3 rounded-sm",
                      getColorClass(level),
                      date ? "cursor-pointer" : "opacity-0",
                    )}
                    title={
                      date ? `${date}: ${contributions} contributions` : ""
                    }
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end space-x-2 text-xs">
        <span className="text-muted-foreground">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn("h-3 w-3 rounded-sm", getColorClass(level))}
          />
        ))}
        <span className="text-muted-foreground">More</span>
      </div>
    </div>
  );
}

function generateMonthLabels(dates: string[]): string[] {
  const months = [
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
  const labels: string[] = [];
  let currentMonth = -1;

  for (let i = 0; i < dates.length; i++) {
    const date = new Date(dates[i]);
    const month = date.getMonth();

    if (month !== currentMonth) {
      labels.push(months[month]);
      currentMonth = month;
    }
  }

  return labels;
}

function getContributionLevel(count: number, max: number): number {
  if (count === 0) return 0;
  const ratio = count / max;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

function getColorClass(level: number): string {
  switch (level) {
    case 0:
      return "bg-muted/20";
    case 1:
      return "bg-chart-1/30";
    case 2:
      return "bg-chart-1/60";
    case 3:
      return "bg-chart-1/80";
    case 4:
      return "bg-chart-1";
    default:
      return "bg-muted/20";
  }
}
