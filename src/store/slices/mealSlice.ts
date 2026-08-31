import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mealService } from '../../services/mealService';
import type { WeeklyMenuRequest, MealMenuResponse } from '../../types/meal.types';
import { isAxiosError } from 'axios';

// Thunk to fetch existing menus for a date range (Enables Editing)[cite: 2]
export const fetchWeeklyMenu = createAsyncThunk(
  'meal/fetchWeekly',
  async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      return await mealService.getWeeklyMenu(startDate, endDate);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message ?? 'Failed to load menu data');
      }
      return rejectWithValue('Failed to load menu data');
    }
  },
);

// Thunk to publish/update the menu
export const publishMenu = createAsyncThunk(
  'meal/publish',
  async (data: WeeklyMenuRequest, { rejectWithValue }) => {
    try {
      return await mealService.publishWeeklyMenu(data);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message ?? 'Failed to publish weekly menu');
      }
      return rejectWithValue('Failed to publish weekly menu');
    }
  },
);

interface MealState {
  weeklyMenus: MealMenuResponse[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MealState = {
  weeklyMenus: [],
  isLoading: false,
  error: null,
};

const mealSlice = createSlice({
  name: 'meal',
  initialState,
  reducers: {
    clearMealError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Handlers
      .addCase(fetchWeeklyMenu.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeeklyMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.weeklyMenus = action.payload; // Store fetched data for editing
      })
      .addCase(fetchWeeklyMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Publish Handlers
      .addCase(publishMenu.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(publishMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.weeklyMenus = action.payload; // Update state with newly saved data
      })
      .addCase(publishMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMealError } = mealSlice.actions;
export default mealSlice.reducer;

export const selectMealLoading = (state: { meal: MealState }) => state.meal.isLoading;
export const selectMealError = (state: { meal: MealState }) => state.meal.error;
export const selectWeeklyMenus = (state: { meal: MealState }) => state.meal.weeklyMenus;
