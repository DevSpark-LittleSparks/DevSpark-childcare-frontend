import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BillingState {
  invoices: any[];
  payments: any[];
}

const initialState: BillingState = {
  invoices: [],
  payments: [],
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setInvoices: (state, action: PayloadAction<any[]>) => {
      state.invoices = action.payload;
    },
    addPayment: (state, action: PayloadAction<any>) => {
      state.payments.push(action.payload);
    },
  },
});

export const { setInvoices, addPayment } = billingSlice.actions;
export default billingSlice.reducer;