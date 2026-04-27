/**
 * Teacher Redux Slice
 * Manages state for TeacherDashboard
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import teacherService from '@/services/teacherService';
import type { TeacherState, FilterOptions, ActivityLog } from '@/types/teacher.types';

const initialState: TeacherState = {
  scheduleData: [],
  logsData: [],
  classStatus: { checkedIn: 0, expected: 0, attendance: 0 },
  safetyAlerts: [],
  parentComms: [],
  teacherProfile: { name: '', classroom: '' },
  showFullSchedule: false,
  searchQuery: '',
  showSearch: false,
  showFilterMenu: false,
  sortOption: 'Time (Newest)',
  activeFilter: 'All',
  showAllLogs: false,
  currentPage: 0,
  loading: false,
  error: null,
};

/**
 * Async Thunk: Fetch complete teacher dashboard data
 */
export const fetchTeacherDashboard = createAsyncThunk(
  'teacher/fetchTeacherDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const data = await teacherService.getTeacherDashboard();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch teacher dashboard'
      );
    }
  }
);

/**
 * Async Thunk: Fetch activity logs with filters
 */
export const fetchActivityLogs = createAsyncThunk(
  'teacher/fetchActivityLogs',
  async (options: FilterOptions, { rejectWithValue }) => {
    try {
      const logs = await teacherService.getActivityLogs(options);
      return logs;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch activity logs'
      );
    }
  }
);

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setShowFullSchedule: (state, action: PayloadAction<boolean>) => {
      state.showFullSchedule = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setShowSearch: (state, action: PayloadAction<boolean>) => {
      state.showSearch = action.payload;
    },
    setShowFilterMenu: (state, action: PayloadAction<boolean>) => {
      state.showFilterMenu = action.payload;
    },
    setSortOption: (state, action: PayloadAction<string>) => {
      state.sortOption = action.payload;
      state.showFilterMenu = false;
    },
    setActiveFilter: (state, action: PayloadAction<string>) => {
      state.activeFilter = action.payload;
      state.showFilterMenu = false;
      state.showAllLogs = true;
    },
    setShowAllLogs: (state, action: PayloadAction<boolean>) => {
      state.showAllLogs = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.sortOption = 'Time (Newest)';
      state.activeFilter = 'All';
      state.showAllLogs = false;
      state.showSearch = false;
      state.showFilterMenu = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch teacher dashboard
    builder
      .addCase(fetchTeacherDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduleData = action.payload.schedule;
        state.classStatus = action.payload.classStatus;
        state.safetyAlerts = action.payload.safetyAlerts;
        state.parentComms = action.payload.parentComms;
        state.teacherProfile = action.payload.profile;
        // Also fetch initial logs
        state.logsData = [];
      })
      .addCase(fetchTeacherDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch activity logs
    builder
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logsData = action.payload;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setShowFullSchedule,
  setSearchQuery,
  setShowSearch,
  setShowFilterMenu,
  setSortOption,
  setActiveFilter,
  setShowAllLogs,
  setCurrentPage,
  resetFilters,
} = teacherSlice.actions;

export default teacherSlice.reducer;
