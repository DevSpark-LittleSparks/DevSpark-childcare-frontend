// ─────────────────────────────────────────────────────────────────────────────
// teacher.types.ts
// All shared TypeScript types for the Teacher feature
// Used by: teacherSlice, TeacherDashboardPage
// ─────────────────────────────────────────────────────────────────────────────

// ── Class Status (live attendance overview) ───────────────────────────────────
export interface ClassStatus {
  classroomName: string;
  checkedIn: number;
  expected: number;
  checkedInPercent: number;
  expectedPercent: number;
}

// ── Safety alert per child ────────────────────────────────────────────────────
export interface SafetyAlert {
  childName: string;
  condition: string; // e.g. "Peanut Allergy", "Asthma"
}

// ── Parent message preview ────────────────────────────────────────────────────
export interface ParentMessage {
  messageId: string;
  parentName: string;
  childName: string;
  preview: string;
  time: string;
  unread: boolean;
}

// ── Upcoming activity slot ────────────────────────────────────────────────────
export interface UpcomingActivity {
  activityId: string;
  startTime: string;  // "09:00 AM"
  endTime: string;    // "10:00 AM"
  name: string;
  description: string;
}

// ── Activity log entry ────────────────────────────────────────────────────────
export interface ActivityLog {
  logId: string;
  childName: string;
  childImage: string;
  logType: string;   // "MEAL", "ATTENDANCE", "ACTIVITY"
  detail: string;    // "BREAKFAST - FULL MEAL"
  time: string;      // "12:35 AM"
}

// ── Redux state shape ─────────────────────────────────────────────────────────
export interface TeacherState {
  classStatus: ClassStatus | null;
  safetyAlerts: SafetyAlert[];
  parentMessages: ParentMessage[];
  upcomingActivities: UpcomingActivity[];
  activityLogs: ActivityLog[];
  loading: boolean;
  error: string | null;
}
