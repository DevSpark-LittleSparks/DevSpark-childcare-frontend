/**
 * Progress Module Types
 * Defines types for AdminProgressPage and ParentProgressPage
 */

export interface ChildrenData {
  id: string;
  name: string;
  totalDays: number;
  attendance: number;
  activities: number;
  mood: string;
  meals: number;
  engagement: number[];
}

export interface Activity {
  id: string;
  title: string;
  time: string;
  teacher: string;
  role: string;
  studentsParticipated: number;
}

export interface EngagementData {
  name: string;
  value: number;
}

export interface DailyProgressData {
  name: string;
  Excellent: number;
  VeryGood: number;
  Good: number;
  Weak: number;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface ParentProfile {
  name: string;
  email?: string;
}

export interface ProgressState {
  childrenData: Record<string, ChildrenData>;
  dailyActivities: Activity[];
  selectedChildId: string;
  dateRange: DateRange;
  showReport: boolean;
  currentPage: number;
  errorMessage: string;
  loading: boolean;
  error: string | null;
}

export interface AttendanceData {
  name: string;
  value: number;
}

export interface ChartData {
  name: string;
  value?: number;
  [key: string]: unknown;
}
