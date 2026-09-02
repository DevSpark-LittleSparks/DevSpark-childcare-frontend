import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AcademicState {
  classes: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AcademicState = {
  classes: [],
  loading: false,
  error: null,
};

const academicSlice = createSlice({
  name: 'academic',
  initialState,
  reducers: {
    setClasses: (state, action: PayloadAction<any[]>) => {
      state.classes = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setClasses, setLoading, setError } = academicSlice.actions;
export default academicSlice.reducer; 