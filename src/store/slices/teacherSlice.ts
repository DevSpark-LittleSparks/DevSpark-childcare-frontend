// ─────────────────────────────────────────────────────────────────────────────
// teacherSlice.ts
// Redux slice for Teacher Dashboard state
// ─────────────────────────────────────────────────────────────────────────────

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  TeacherState,
  ClassStatus,
  SafetyAlert,
  ParentMessage,
  UpcomingActivity,
  ActivityLog,
} from '../../types/teacher.types';

// ── Initial state ─────────────────────────────────────────────────────────────
const initialState: TeacherState = {
  classStatus: null,
  safetyAlerts: [],
  parentMessages: [],
  upcomingActivities: [],
  activityLogs: [],
  loading: false,
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────
const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setClassStatus(state, action: PayloadAction<ClassStatus | null>) {
      state.classStatus = action.payload;
    },
    setSafetyAlerts(state, action: PayloadAction<SafetyAlert[]>) {
      state.safetyAlerts = action.payload;
    },
    setParentMessages(state, action: PayloadAction<ParentMessage[]>) {
      state.parentMessages = action.payload;
    },
    setUpcomingActivities(state, action: PayloadAction<UpcomingActivity[]>) {
      state.upcomingActivities = action.payload;
    },
    setActivityLogs(state, action: PayloadAction<ActivityLog[]>) {
      state.activityLogs = action.payload;
    },
    // Mark a single message as read locally (optimistic update)
    markMessageRead(state, action: PayloadAction<string>) {
      const msg = state.parentMessages.find(m => m.messageId === action.payload);
      if (msg) msg.unread = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setClassStatus,
  setSafetyAlerts,
  setParentMessages,
  setUpcomingActivities,
  setActivityLogs,
  markMessageRead,
  setLoading,
  setError,
} = teacherSlice.actions;

export default teacherSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectClassStatus        = (s: any) => s.teacher.classStatus       as ClassStatus | null;
export const selectSafetyAlerts       = (s: any) => s.teacher.safetyAlerts      as SafetyAlert[];
export const selectParentMessages     = (s: any) => s.teacher.parentMessages    as ParentMessage[];
export const selectUpcomingActivities = (s: any) => s.teacher.upcomingActivities as UpcomingActivity[];
export const selectActivityLogs       = (s: any) => s.teacher.activityLogs      as ActivityLog[];
export const selectTeacherLoading     = (s: any) => s.teacher.loading           as boolean;
export const selectTeacherError       = (s: any) => s.teacher.error             as string | null;
export const selectUnreadMessageCount = (s: any) =>
  (s.teacher.parentMessages as ParentMessage[]).filter(m => m.unread).length;
