import { ContributionCalendar } from "./ContributionCalendar";
import { HourlyStats } from "./HourlyStats";
import { MonthlyStats } from "./MonthlyStats";
import { WeekdayStats } from "./WeekdayStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface GitStatsData {
  generated_at: string;
  lifetime_stats: {
    total_commits: number;
    total_prs: number;
    files_changed: number;
  };
  code_contribution: {
    lines_added: number;
    lines_deleted: number;
  };
  contribution_calendar: {
    daily_commits: Record<string, number>;
  };
  monthly_activity: {
    commits: Record<string, number>;
    pull_requests: Record<string, number>;
    code_changes: Record<string, { added: number; deleted: number }>;
  };
  weekday_activity: Record<string, number>;
  hourly_activity: Record<string, number>;
}

export function ContributionDashboard({ data }: { data: GitStatsData }) {
  const generatedDate = new Date(data.generated_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Total Commits"
          value={data.lifetime_stats.total_commits.toLocaleString()}
          description="Lifetime commits contributed"
          icon="ph-code-commit"
        />
        <StatsCard
          title="Total PRs"
          value={data.lifetime_stats.total_prs.toLocaleString()}
          description="Pull requests created"
          icon="ph-git-pull-request"
        />
        <StatsCard
          title="Lines Changed"
          value={formatLineCount(
            data.code_contribution.lines_added +
              data.code_contribution.lines_deleted,
          )}
          description={`${formatLineCount(data.code_contribution.lines_added)} added, ${formatLineCount(data.code_contribution.lines_deleted)} deleted`}
          icon="ph-code-block"
        />
      </div>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Contribution Calendar</TabsTrigger>
          {/* <TabsTrigger value="monthly">Monthly Activity</TabsTrigger> */}
          <TabsTrigger value="weekday">Weekday Pattern</TabsTrigger>
          {/* <TabsTrigger value="hourly">Time of Day</TabsTrigger> */}
        </TabsList>
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contribution Calendar</CardTitle>
              <CardDescription>
                Commit activity over the past year (as of {generatedDate})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContributionCalendar
                data={data.contribution_calendar.daily_commits}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
              <CardDescription>
                Commits, pull requests, and code changes by month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyStats
                commits={data.monthly_activity.commits}
                pullRequests={data.monthly_activity.pull_requests}
                codeChanges={data.monthly_activity.code_changes}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekday" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekday Contribution Pattern</CardTitle>
              <CardDescription>
                When you contribute the most during the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WeekdayStats data={data.weekday_activity} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hourly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Time of Day Activity</CardTitle>
              <CardDescription>
                When you're most active throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HourlyStats data={data.hourly_activity} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-right text-xs text-muted-foreground">
        Data generated on {generatedDate}
      </p>
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <i className={`${icon} text-xl text-muted-foreground`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
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
