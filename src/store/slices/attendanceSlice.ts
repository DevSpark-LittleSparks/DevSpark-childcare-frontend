import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { attendanceService } from '../../services/attendanceService';
import type { ChildAttendanceDTO } from '../../types/attendance.types';
import { format } from 'date-fns';

interface AttendanceState {
  records: ChildAttendanceDTO[];
  selectedDate: string;
  isEditMode: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const getErrorMessage = (error: unknown): string => {
  const err = error as { response?: { data?: unknown }; message?: string };
  if (err.response?.data) {
    return JSON.stringify(err.response.data);
  }
  return err.message ?? 'An unknown error occurred';
};

export const fetchAttendanceByDate = createAsyncThunk(
  'attendance/fetchByDate',
  async (date: string, { rejectWithValue }) => {
    try {
      return await attendanceService.getByDate(date);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const saveAttendanceBulk = createAsyncThunk(
  'attendance/saveBulk',
  async (attendances: ChildAttendanceDTO[], { getState, rejectWithValue }) => {
    const state = getState() as { attendance: AttendanceState };
    const date = state.attendance.selectedDate;

    // 🚀 100% REAL-TIME & SECURE FIX 🚀
    // We REMOVED 'recordedBy' entirely!
    // According to standard architecture, the Frontend should NEVER send the User ID in the body.
    // The Spring Boot Backend automatically extracts the securely logged-in Teacher from the JWT Token!
    // This prevents the "Cannot deserialize UUID" JSON Parse Error.
    const payload = {
      date: date,
      attendances: attendances,
    };

    try {
      await attendanceService.saveBulk(
        payload as unknown as Parameters<typeof attendanceService.saveBulk>[0],
      );
      return attendances;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState: AttendanceState = {
  records: [],
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  isEditMode: true,
  isLoading: false,
  isSaving: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },
    toggleEditMode(state) {
      state.isEditMode = !state.isEditMode;
    },
    setEditMode(state, action: PayloadAction<boolean>) {
      state.isEditMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceByDate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceByDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(fetchAttendanceByDate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(saveAttendanceBulk.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(saveAttendanceBulk.fulfilled, (state, action) => {
        state.isSaving = false;
        state.records = action.payload;
      })
      .addCase(saveAttendanceBulk.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedDate, toggleEditMode, setEditMode } = attendanceSlice.actions;
export default attendanceSlice.reducer;

export const selectAttendanceRecords = (state: { attendance: AttendanceState }) =>
  state.attendance.records;
export const selectSelectedDate = (state: { attendance: AttendanceState }) =>
  state.attendance.selectedDate;
export const selectIsEditMode = (state: { attendance: AttendanceState }) =>
  state.attendance.isEditMode;
export const selectAttendanceLoading = (state: { attendance: AttendanceState }) =>
  state.attendance.isLoading;
export const selectAttendanceSaving = (state: { attendance: AttendanceState }) =>
  state.attendance.isSaving;
