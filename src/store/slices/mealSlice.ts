import { createSlice } from '@reduxjs/toolkit';

const mealSlice = createSlice({
  name: 'meal',
  initialState: { menu: [], loading: false },
  reducers: {},
});

export default mealSlice.reducer;
