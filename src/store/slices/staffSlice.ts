/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../services/axiosInstance';

// 💡 Calling /api/v1/teacher in the TeacherController in the backend
export const fetchStaff = createAsyncThunk('staff/fetchStaff', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/teacher');
    // Since the TeacherController returns a Page, it gets it from .content or data
    const data = response.data?.data;
    return data?.content || data || [];
  } catch (error: any) {
    console.error('Failed to fetch staff from backend:', error);
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch staff');
  }
});

interface StaffState {
  list: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  list: [],
  isLoading: false,
  error: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaff: (state, action) => {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setStaff } = staffSlice.actions;
export default staffSlice.reducer;
