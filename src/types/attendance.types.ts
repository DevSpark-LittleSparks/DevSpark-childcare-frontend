export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'UNMARKED';

// Matches ChildAttendanceDTO.java
export interface ChildAttendanceDTO {
  childId: string;
  childName: string; // Used for UI display
  status: AttendanceStatus;
  checkIn: string | null;
  checkOut: string | null;
  notes?: string;
}

// Matches BulkAttendanceRequestDTO.java
export interface BulkAttendanceRequestDTO {
  date: string;
  recordedBy: string;
  attendances: ChildAttendanceDTO[];
}
