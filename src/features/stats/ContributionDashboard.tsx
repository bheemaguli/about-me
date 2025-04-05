import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContributionCalendar } from "./ContributionCalendar";
import { HourlyStats } from "./HourlyStats";
import { WeekdayStats } from "./WeekdayStats";
import { GitStatsData } from "./types";
import { formatLineCount } from "./utils";

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
        <i className={`${icon} text-muted-foreground text-xl`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}

export function ContributionDashboard({ data }: { data: GitStatsData }) {
  const parsedData = GitStatsData.parse(data);
  const generatedDate = new Date(parsedData.generated_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Total Commits"
          value={parsedData.lifetime_stats.total_commits.toLocaleString()}
          description="Lifetime commits contributed"
          icon="ph-code-commit"
        />
        <StatsCard
          title="Total PRs"
          value={parsedData.lifetime_stats.total_prs.toLocaleString()}
          description="Pull requests created"
          icon="ph-git-pull-request"
        />
        <StatsCard
          title="Lines Changed"
          value={formatLineCount(
            parsedData.code_contribution.lines_added +
              parsedData.code_contribution.lines_deleted,
          )}
          description={`${formatLineCount(parsedData.code_contribution.lines_added)} added, ${formatLineCount(parsedData.code_contribution.lines_deleted)} deleted`}
          icon="ph-code-block"
        />
      </div>
      <Tabs defaultValue="calendar">
        <TabsList className="space-x-2">
          <TabsTrigger value="calendar">Contribution Calendar</TabsTrigger>
          <TabsTrigger value="weekday">Weekday Pattern</TabsTrigger>
          <TabsTrigger value="hourly">Time of Day</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Contribution Calendar</CardTitle>
              <CardDescription>
                Commit activity over the past year (as of {generatedDate})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContributionCalendar data={parsedData.contribution_calendar} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekday">
          <Card>
            <CardHeader>
              <CardTitle>Weekday Contribution Pattern</CardTitle>
              <CardDescription>
                When you contribute the most during the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WeekdayStats data={parsedData.weekday_activity} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hourly">
          <Card>
            <CardHeader>
              <CardTitle>Time of Day Activity</CardTitle>
              <CardDescription>
                When you're most active throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HourlyStats data={parsedData.hourly_activity} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-muted-foreground text-right text-xs">
        Data generated on {generatedDate}
      </p>
    </div>
  );
}
