// ─────────────────────────────────────────────────────────────────────────────
// progressSlice.ts
// Redux slice for all progress-related state
// Covers: Parent Progress page + Admin Learning Progress page
// ─────────────────────────────────────────────────────────────────────────────

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  ProgressState,
  ProgressChild,
  ProgressStats,
  DailyEngagement,
  AttendanceStats,
  DailyProgressEntry,
  DailyActivity,
} from '../../types/progress.types';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (d: Date) => d.toISOString().split('T')[0];

// ── Initial state ─────────────────────────────────────────────────────────────
const initialState: ProgressState = {
  // Parent
  children: [],
  selectedChildId: null,
  fromDate: '',
  toDate: '',
  stats: null,
  engagement: [],
  attendance: null,

  // Admin
  adminSelectedDate: fmt(new Date()),
  adminDailyProgress: [],
  adminActivities: [],

  // Shared
  loading: false,
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────
const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    // ── Parent reducers ───────────────────────────────────────────────────────
    setChildren(state, action: PayloadAction<ProgressChild[]>) {
      state.children = action.payload;
      // No auto-select — parent must explicitly choose a child
    },
    setSelectedChild(state, action: PayloadAction<string>) {
      state.selectedChildId = action.payload;
    },
    setDateRange(state, action: PayloadAction<{ from: string; to: string }>) {
      state.fromDate = action.payload.from;
      state.toDate   = action.payload.to;
    },
    setStats(state, action: PayloadAction<ProgressStats | null>) {
      state.stats = action.payload;
    },
    setEngagement(state, action: PayloadAction<DailyEngagement[]>) {
      state.engagement = action.payload;
    },
    setAttendance(state, action: PayloadAction<AttendanceStats | null>) {
      state.attendance = action.payload;
    },

    // ── Admin reducers ────────────────────────────────────────────────────────
    setAdminSelectedDate(state, action: PayloadAction<string>) {
      state.adminSelectedDate = action.payload;
    },
    setAdminDailyProgress(state, action: PayloadAction<DailyProgressEntry[]>) {
      state.adminDailyProgress = action.payload;
    },
    setAdminActivities(state, action: PayloadAction<DailyActivity[]>) {
      state.adminActivities = action.payload;
    },

    // ── Shared reducers ───────────────────────────────────────────────────────
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetProgress(state) {
      state.stats      = null;
      state.engagement = [];
      state.attendance = null;
      state.error      = null;
    },
  },
});

export const {
  setChildren,
  setSelectedChild,
  setDateRange,
  setStats,
  setEngagement,
  setAttendance,
  setAdminSelectedDate,
  setAdminDailyProgress,
  setAdminActivities,
  setLoading,
  setError,
  resetProgress,
} = progressSlice.actions;

export default progressSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectProgressChildren       = (s: any) => s.progress.children         as ProgressChild[];
export const selectSelectedChildId        = (s: any) => s.progress.selectedChildId  as string | null;
export const selectProgressDateRange      = (s: any) => ({ from: s.progress.fromDate, to: s.progress.toDate });
export const selectProgressStats          = (s: any) => s.progress.stats            as ProgressStats | null;
export const selectEngagement             = (s: any) => s.progress.engagement       as DailyEngagement[];
export const selectAttendance             = (s: any) => s.progress.attendance       as AttendanceStats | null;
export const selectAdminSelectedDate      = (s: any) => s.progress.adminSelectedDate as string;
export const selectAdminDailyProgress     = (s: any) => s.progress.adminDailyProgress as DailyProgressEntry[];
export const selectAdminActivities        = (s: any) => s.progress.adminActivities  as DailyActivity[];
export const selectProgressLoading        = (s: any) => s.progress.loading          as boolean;
export const selectProgressError          = (s: any) => s.progress.error            as string | null;
