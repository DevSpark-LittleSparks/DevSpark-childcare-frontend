/**
 * Teacher Module Types
 * Defines types for TeacherDashboard
 */

export interface Schedule {
  id: string;
  time: string;
  title: string;
  desc: string;
  colorType: 'blue' | 'orange' | 'purple';
  icon: string;
}

export interface ActivityLog {
  id: string;
  studentName: string;
  tag: 'ACTIVITY' | 'MEALS' | 'ATTENDANCE' | string;
  actionText: string;
  time: string;
  timestamp: number;
  icon: string;
  iconColor: string;
}

export interface ClassStatus {
  checkedIn: number;
  expected: number;
  attendance: number;
}

export interface SafetyAlert {
  id: string;
  title: string;
  colorType: 'orange' | 'blue';
}

export interface ParentComm {
  id: string;
  parentName: string;
  message: string;
  avatarBg: string;
  avatarFill: string;
}

export interface TeacherProfile {
  name: string;
  classroom: string;
}

export interface FilterOptions {
  searchQuery?: string;
  activeFilter?: string;
  sortOption?: 'Time (Newest)' | 'Time (Oldest)' | 'Name (A-Z)';
}

export interface TeacherState {
  scheduleData: Schedule[];
  logsData: ActivityLog[];
  classStatus: ClassStatus;
  safetyAlerts: SafetyAlert[];
  parentComms: ParentComm[];
  teacherProfile: TeacherProfile;
  showFullSchedule: boolean;
  searchQuery: string;
  showSearch: boolean;
  showFilterMenu: boolean;
  sortOption: string;
  activeFilter: string;
  showAllLogs: boolean;
  currentPage: number;
  loading: boolean;
  error: string | null;
}
