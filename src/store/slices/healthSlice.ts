import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HealthState {
  mealPlans: any[];
  allergies: any[];
}

const initialState: HealthState = {
  mealPlans: [],
  allergies: [],
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    setMeals: (state, action: PayloadAction<any[]>) => {
      state.mealPlans = action.payload;
    },
    updateAllergies: (state, action: PayloadAction<any[]>) => {
      state.allergies = action.payload;
    },
  },
});

export const { setMeals, updateAllergies } = healthSlice.actions;
export default healthSlice.reducer;