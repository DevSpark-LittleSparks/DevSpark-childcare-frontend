// ─────────────────────────────────────────────────────────────────────────────
// progress.types.ts
// All shared TypeScript types for the Progress feature
// Used by: ProgressSlice, ParentProgressPage, AdminProgressPage, chart components
// ─────────────────────────────────────────────────────────────────────────────

// ── Stat summary cards ────────────────────────────────────────────────────────
export interface ProgressStats {
  daysPresent: number;
  activitiesCompleted: number;
  avgMood: string;           // e.g. "75%"
  level1Percent: number;
  level2Percent: number;
  level3Percent: number;
  level4Percent: number;
  mealsProvided: string;     // "Full" | "Partial" | "None"
  fullMealPercent: number;
  partialMealPercent: number;
  noMealPercent: number;
}

// ── One activity's hours on a given day ────────────────────────────────────────
export interface DailyActivityHours {
  activityName: string;
  hours: number;
}

// ── One day's engagement entry (for bar chart) ────────────────────────────────
export interface DailyEngagement {
  day: string;    // "Aug 10", etc.
  date: string;   // ISO date string "2026-05-12"
  activities: DailyActivityHours[];
}

// ── Attendance summary ────────────────────────────────────────────────────────
export interface AttendanceStats {
  presentDays: number;
  absentDays: number;
  attendanceRate: number; // 0-100
}

// ── Child reference (used in selectors) ──────────────────────────────────────
export interface ProgressChild {
  childId: string;
  name: string;
}

// ── Admin: daily progress entry (stacked bar per performance level) ───────────
export interface DailyProgressEntry {
  date: string;         // "2026-05-12"
  Excellent: number;
  Good: number;
  VeryGood: number;
  Weak: number;
}

// ── Admin: activity in the daily activity list ───────────────────────────────
export interface DailyActivity {
  activityName: string;
  time: string;           // "09:00"
  teacherName: string;
  teacherRole: string;    // "Teacher"
  studentCount: number;
  participationStatus: string; // "Participated" | "Not Participated"
}

// ── Redux state shape ─────────────────────────────────────────────────────────
export interface ProgressState {
  // Parent progress
  children: ProgressChild[];
  selectedChildId: string | null;
  fromDate: string;
  toDate: string;
  stats: ProgressStats | null;
  engagement: DailyEngagement[];
  attendance: AttendanceStats | null;

  // Admin learning progress
  adminSelectedDate: string;
  adminDailyProgress: DailyProgressEntry[];
  adminActivities: DailyActivity[];

  // Shared
  loading: boolean;
  error: string | null;
}
