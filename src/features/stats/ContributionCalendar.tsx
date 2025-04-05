import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { Contributioncalendar } from "./types";

export function ContributionCalendar({ data }: { data: Contributioncalendar }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const parsedData = Contributioncalendar.parse(data);
  const dailyCommits = parsedData.daily_commits;

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, []);

  // Get all dates sorted
  const dates = Object.keys(dailyCommits).sort();

  // Return early if no dates
  if (dates.length === 0) {
    return null;
  }

  // Find max contribution to normalize colors
  const maxContribution = Math.max(...Object.values(dailyCommits));

  // Group dates by week for display
  const weeks: string[][] = [];
  let currentWeek: string[] = [];

  // Calculate the day of week for the first date (0 = Sunday, 6 = Saturday)
  const firstDate = new Date(dates[0] as string);
  const firstDayOfWeek = firstDate.getDay();

  // Add empty cells for the first week if needed
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push("");
  }

  // Group all dates into weeks
  dates.forEach((date) => {
    const day = new Date(date as string).getDay();

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
  const MonthLabels = () => {
    return (
      <div
        className="ml-6 flex flex-col items-center text-sm"
        style={{ width: `${20 * weeks.length}px` }}
      >
        <div className="flex w-full">
          {monthLabels.map((month, i) => (
            <div key={i} className="flex-1 text-center">
              {month}
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center">
        <div className="mt-6 flex flex-col space-y-3 text-xs">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((day) => (
            <div className="text-muted-foreground row-span-1 pr-2 text-right">
              {day}
            </div>
          ))}
        </div>
        <div
          className="flex flex-col space-y-3 overflow-auto"
          ref={containerRef}
        >
          <MonthLabels />
          <div className="flex flex-col">
            <div className="grid grid-flow-col grid-rows-7 gap-1 pb-2 text-xs">
              {weeks.map((week, weekIdx) => (
                <React.Fragment key={weekIdx}>
                  {week.map((date, dayIdx) => {
                    const contributions = date ? dailyCommits[date] || 0 : 0;
                    const level = getContributionLevel(
                      contributions,
                      maxContribution,
                    );

                    return (
                      <div className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-sm border">
                        <div
                          key={`${weekIdx}-${dayIdx}`}
                          className={cn(
                            "h-4 w-4",
                            getColorClass(level),
                            date ? "cursor-pointer" : "opacity-0",
                          )}
                          title={
                            date
                              ? `${date}: ${contributions} contributions`
                              : ""
                          }
                        />
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 text-xs">
        <span className="text-muted-foreground">Less</span>
        {[1, 2, 3, 4].map((level) => (
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

  // Calculate number of weeks
  const totalWeeks = Math.ceil(dates.length / 7);

  for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
    const dateIndex = weekIndex * 7;
    if (dateIndex >= dates.length) break;

    const date = new Date(dates[dateIndex]);
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
      return "bg-transparent";
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
