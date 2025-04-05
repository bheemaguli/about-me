import { z } from "zod";

export const Lifetimestats = z.object({
  total_commits: z.number(),
  total_prs: z.number(),
  files_changed: z.number(),
});
export type Lifetimestats = z.infer<typeof Lifetimestats>;

export const Codecontribution = z.object({
  lines_added: z.number(),
  lines_deleted: z.number(),
});
export type Codecontribution = z.infer<typeof Codecontribution>;

export const Contributioncalendar = z.object({
  daily_commits: z.record(z.string(), z.number()),
});
export type Contributioncalendar = z.infer<typeof Contributioncalendar>;

export const Monthlyactivity = z.object({
  commits: z.record(z.string(), z.number()),
  pull_requests: z.record(z.string(), z.number()),
  code_changes: z.record(
    z.string(),
    z.object({ added: z.number(), deleted: z.number() }),
  ),
});
export type Monthlyactivity = z.infer<typeof Monthlyactivity>;

export const Weekdayactivity = z.object({
  Monday: z.number(),
  Tuesday: z.number(),
  Wednesday: z.number(),
  Thursday: z.number(),
  Friday: z.number(),
  Saturday: z.number(),
  Sunday: z.number(),
});
export type Weekdayactivity = z.infer<typeof Weekdayactivity>;

export const Hourlyactivity = z.record(z.string(), z.number());
export type Hourlyactivity = z.infer<typeof Hourlyactivity>;

export const GitStatsData = z.object({
  generated_at: z.string(),
  date_range: z.object({ start_date: z.string(), end_date: z.string() }),
  lifetime_stats: Lifetimestats,
  code_contribution: Codecontribution,
  contribution_calendar: Contributioncalendar,
  monthly_activity: Monthlyactivity,
  weekday_activity: Weekdayactivity,
  hourly_activity: Hourlyactivity,
});
export type GitStatsData = z.infer<typeof GitStatsData>;
