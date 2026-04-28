/**
 * Progress Redux Slice
 * Manages state for AdminProgressPage and ParentProgressPage
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import progressService from '@/services/progressService';
import type { ProgressState, ChildrenData, DailyProgressData } from '@/types/progress.types';
import { MOCK_DAILY_PROGRESS } from '@/shared/mock/progressMockData';

const initialState: ProgressState = {
  childrenData: {},
  dailyActivities: [],
  dailyProgressData: [],
  selectedChildId: '',
  dateRange: { from: '', to: '' },
  showReport: false,
  currentPage: 0,
  errorMessage: '',
  loading: false,
  error: null,
};

/**
 * Async Thunk: Fetch children data
 */
export const fetchProgressData = createAsyncThunk(
  'progress/fetchProgressData',
  async (filter?: string, { rejectWithValue }) => {
    try {
      const data = await progressService.getChildrenData(filter);
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch progress data'
      );
    }
  }
);

/**
 * Async Thunk: Fetch daily progress stats
 */
export const fetchDailyProgress = createAsyncThunk(
  'progress/fetchDailyProgress',
  async (date: string, { rejectWithValue }) => {
    try {
      const data = await progressService.getDailyProgress(date);
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch daily progress');
    }
  }
);

export const fetchDailyActivities = createAsyncThunk(
  'progress/fetchDailyActivities',
  async ({ childId, date }: { childId: string; date: string }, { rejectWithValue }) => {
    try {
      const activities = await progressService.getDailyActivities(childId, date);
      return activities;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch daily activities'
      );
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setSelectedChild: (state, action: PayloadAction<string>) => {
      state.selectedChildId = action.payload;
      state.errorMessage = '';
      state.showReport = false;
    },
    setDateRange: (state, action: PayloadAction<{ from: string; to: string }>) => {
      state.dateRange = action.payload;
      state.errorMessage = '';
      state.showReport = false;
    },
    setShowReport: (state, action: PayloadAction<boolean>) => {
      state.showReport = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = '';
    },
    resetProgress: (state) => {
      state.selectedChildId = '';
      state.dateRange = { from: '', to: '' };
      state.showReport = false;
      state.currentPage = 0;
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    // Fetch progress data
    builder
      .addCase(fetchProgressData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressData.fulfilled, (state, action) => {
        state.loading = false;
        // Convert array to Record for easy lookup
        state.childrenData = action.payload.reduce(
          (acc, child) => {
            acc[child.id] = child;
            return acc;
          },
          {} as Record<string, ChildrenData>
        );
      })
      .addCase(fetchProgressData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch daily activities
    builder
      .addCase(fetchDailyActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyActivities = action.payload;
      })
      .addCase(fetchDailyActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch daily progress
    builder
      .addCase(fetchDailyProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDailyProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyProgressData = action.payload;
      })
      .addCase(fetchDailyProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedChild,
  setDateRange,
  setShowReport,
  setCurrentPage,
  setErrorMessage,
  clearErrorMessage,
  resetProgress,
} = progressSlice.actions;

export default progressSlice.reducer;
