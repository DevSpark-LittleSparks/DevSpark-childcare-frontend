import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StaffState {
  staffList: any[];
}

const initialState: StaffState = {
  staffList: [],
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaff: (state, action: PayloadAction<any[]>) => {
      state.staffList = action.payload;
    },
  },
});

export const { setStaff } = staffSlice.actions;
export default staffSlice.reducer;