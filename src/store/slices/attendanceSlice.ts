import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { attendanceService } from '../../services/attendanceService';
import type { ChildAttendanceDTO } from '../../types/attendance.types';
import { format } from 'date-fns';

// Create a local interface for the state to avoid 'any' type
interface AttendanceState {
  records: ChildAttendanceDTO[];
  selectedDate: string;
  isEditMode: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

export const fetchAttendanceByDate = createAsyncThunk(
  'attendance/fetchByDate',
  async (date: string) => {
    return await attendanceService.getByDate(date);
  },
);

export const saveAttendanceBulk = createAsyncThunk(
  'attendance/saveBulk',
  async (attendances: ChildAttendanceDTO[], { getState }) => {
    // Correctly typing the state without using 'any'
    const state = getState() as { attendance: AttendanceState };
    const date = state.attendance.selectedDate;

    // Matched exactly with your Spring Boot BulkAttendanceRequestDTO!
    const payload = {
      date: date,
      // Temporarily using a dummy UUID. Later you can get this from the Auth slice
      recordedBy: '123e4567-e89b-12d3-a456-426614174000',
      attendances: attendances, // Changed from 'records' to 'attendances'
    };

    // We cast to any here just for the Axios call to bypass strict local type checks
    // until your attendance.types.ts is perfectly matched with the backend.
    await attendanceService.saveBulk(
      payload as unknown as Parameters<typeof attendanceService.saveBulk>[0],
    );
  },
);

const initialState: AttendanceState = {
  records: [
    /* //................testinggg
    { childId: '1', childName: 'Leo Das', status: 'UNMARKED', checkIn: null, checkOut: null },
    { childId: '2', childName: 'Mia Khan', status: 'UNMARKED', checkIn: null, checkOut: null },
    { childId: '3', childName: 'Noah Kim', status: 'UNMARKED', checkIn: null, checkOut: null },

    //................testinggg  */
  ],
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
        state.error = action.error.message || 'Failed to fetch';
      })
      .addCase(saveAttendanceBulk.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(saveAttendanceBulk.fulfilled, (state) => {
        state.isSaving = false;
      })
      .addCase(saveAttendanceBulk.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || 'Failed to save';
      });
  },
});

// Export actions ONLY ONCE to fix the "Duplicate identifier" error
export const { setSelectedDate, toggleEditMode, setEditMode } = attendanceSlice.actions;
export default attendanceSlice.reducer;

// Selectors
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
