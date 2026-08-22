import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient as api } from '../../../services/axiosInstance';

export interface SettingsState {
  theme: string;
  language: string;
  currency: string;
  timezone: string;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  theme: localStorage.getItem('app_theme') || 'light',
  language: localStorage.getItem('app_language') || 'en-US',
  currency: localStorage.getItem('app_currency') || 'LKR',
  timezone: localStorage.getItem('app_timezone') || 'Asia/Colombo',
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk('settings/fetchSettings', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/settings');
    // Save to local storage for quick initial load on refresh
    const data = response.data.data;
    localStorage.setItem('app_theme', data.theme);
    localStorage.setItem('app_language', data.language);
    localStorage.setItem('app_currency', data.currency);
    localStorage.setItem('app_timezone', data.timezone);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
  }
});

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settings: Partial<SettingsState>, { rejectWithValue }) => {
    try {
      const response = await api.put('/settings', settings);
      const data = response.data.data;
      
      // Update local storage
      if (data.theme) localStorage.setItem('app_theme', data.theme);
      if (data.language) localStorage.setItem('app_language', data.language);
      if (data.currency) localStorage.setItem('app_currency', data.currency);
      if (data.timezone) localStorage.setItem('app_timezone', data.timezone);
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Optimistic local update before saving to DB
    setLocalSetting: (state, action: PayloadAction<{key: keyof SettingsState, value: string}>) => {
      const { key, value } = action.payload;
      (state as any)[key] = value;
      localStorage.setItem(`app_${key}`, value);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.theme = action.payload.theme;
        state.language = action.payload.language;
        state.currency = action.payload.currency;
        state.timezone = action.payload.timezone;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.theme = action.payload.theme;
        state.language = action.payload.language;
        state.currency = action.payload.currency;
        state.timezone = action.payload.timezone;
      });
  },
});

export const { setLocalSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
