import { Card, CardContent } from "./ui/card";

interface MonthlyStatsProps {
  commits: Record<string, number>;
  pullRequests: Record<string, number>;
  codeChanges: Record<string, { added: number; deleted: number }>;
}

export function MonthlyStats({
  commits,
  pullRequests,
  codeChanges,
}: MonthlyStatsProps) {
  const months = Object.keys(commits).sort();

  // Calculate maximum values for scaling
  const maxCommits = Math.max(...Object.values(commits));
  const maxPRs = Math.max(...Object.values(pullRequests));

  const maxCodeChanges = Math.max(
    ...months.map(
      (month) =>
        (codeChanges[month]?.added ?? 0) + (codeChanges[month]?.deleted ?? 0),
    ),
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-sm font-medium">Commits & Pull Requests</h3>
          <div className="flex h-64 items-end space-x-2">
            {months.map((month) => {
              const commitCount = commits[month] || 0;
              const prCount = pullRequests[month] || 0;

              const commitHeight = (commitCount / maxCommits) * 100;
              const prHeight = (prCount / maxPRs) * 100;

              const formattedMonth = formatMonthLabel(month);

              return (
                <div key={month} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full flex-col items-center space-y-1">
                    <div
                      className="w-full rounded-t bg-chart-1"
                      style={{ height: `${commitHeight}%` }}
                      title={`${commitCount} commits in ${formattedMonth}`}
                    />
                    <div
                      className="w-full rounded-t bg-chart-2"
                      style={{ height: `${prHeight}%` }}
                      title={`${prCount} PRs in ${formattedMonth}`}
                    />
                  </div>
                  <div className="mt-2 origin-left rotate-45 text-xs text-muted-foreground">
                    {formattedMonth}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="h-3 w-3 rounded-sm bg-chart-1" />
              <span className="text-xs">Commits</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-3 w-3 rounded-sm bg-chart-2" />
              <span className="text-xs">Pull Requests</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-sm font-medium">Code Changes</h3>
          <div className="flex h-64 items-end space-x-2">
            {months.map((month) => {
              const changes = codeChanges[month] || { added: 0, deleted: 0 };
              const added = changes.added || 0;
              const deleted = changes.deleted || 0;

              const totalChanges = added + deleted;
              const barHeight = (totalChanges / maxCodeChanges) * 100;

              // Calculate proportions for the stacked bar
              const addedProportion = added / totalChanges;
              const deletedProportion = deleted / totalChanges;

              const formattedMonth = formatMonthLabel(month);

              return (
                <div key={month} className="flex flex-1 flex-col items-center">
                  <div
                    className="relative w-full"
                    style={{ height: `${barHeight}%` }}
                    title={`${formatLineCount(added)} added, ${formatLineCount(deleted)} deleted in ${formattedMonth}`}
                  >
                    <div
                      className="absolute bottom-0 w-full rounded-t bg-chart-3"
                      style={{ height: `${deletedProportion * 100}%` }}
                    />
                    <div
                      className="absolute bottom-0 w-full rounded-t bg-chart-4"
                      style={{ height: `${addedProportion * 100}%` }}
                    />
                  </div>
                  <div className="mt-2 origin-left rotate-45 text-xs text-muted-foreground">
                    {formattedMonth}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="h-3 w-3 rounded-sm bg-chart-4" />
              <span className="text-xs">Lines Added</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-3 w-3 rounded-sm bg-chart-3" />
              <span className="text-xs">Lines Deleted</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatMonthLabel(monthStr: string): string {
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

function formatLineCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toLocaleString();
}
