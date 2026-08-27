// src/types/activity.types.ts

// ==========================================
// 1. MASTER ACTIVITY TYPES (Admin Side)
// ==========================================

export interface MasterActivity {
  id: string;
  name: string;
  category: string;
  description: string;
  materialsNeeded?: string;
}

export interface MasterActivityCreateRequest {
  name: string;
  category: string;
  description: string;
  materialsNeeded?: string;
}

// ==========================================
// 2. ASSIGNMENT TYPES (Admin & Teacher Side)
// ==========================================

// Added 'ASSIGNED' to support existing Teacher component states
export type AssignmentStatus = 'DRAFT' | 'PUBLISHED' | 'ASSIGNED' | 'COMPLETED';

export interface Assignment {
  id: string;
  teacherId: string;
  teacherName: string;
  initials: string;
  activityId: string;
  activityName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AssignmentStatus;
}

export interface AssignActivityRequest {
  teacherId: string;
  activityId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AssignmentStatus;
}

// Defined specifically to match the mock data in the older activitySlice.ts
export interface ActivityAssignmentDTO {
  assignmentId: string;
  activity: {
    id: string;
    name: string;
    category: string;
    description: string;
    materialsNeeded: string;
  };
  startTime: string;
  endTime: string;
  status: AssignmentStatus;

  // Optional fields just in case they are needed later
  date?: string;
  teacherId?: string;
  teacherName?: string;
  initials?: string;
}

// ==========================================
// 3. PROGRESS LOGGING TYPES (Teacher Side)
// ==========================================

// Expanded to match 'AVERAGE' and 'NEEDS_HELP' values found in LogProgressForm
export type ProgressLevel = 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_HELP' | 'NEEDS_IMPROVEMENT';

// Updated to match the exact array structure expected in LogProgressForm and Redux slice
export interface StudentProgressDTO {
  studentId: string;
  studentName: string;
  attendanceStatus: 'PRESENT' | 'ABSENT';
  progress: ProgressLevel | string;
  note?: string | null;
  assignmentId?: string; // Needed for Redux slice payload matching
}

export interface SaveProgressPayload {
  assignmentId: string;
  logs: StudentProgressDTO[];
}
