import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import academicReducer from './slices/academicSlice';
import authReducer from './slices/authSlice';
import billingReducer from './slices/billingSlice';
import healthReducer from './slices/healthSlice';
import staffReducer from './slices/staffSlice';
import settingsReducer from '../features/settings/model/settingsSlice';

export const store = configureStore({
  reducer: {
    academic: academicReducer,
    auth: authReducer,
    billing: billingReducer,
    health: healthReducer,
    staff: staffReducer,
    settings: settingsReducer,
  },
  devTools: true,
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// must be 
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;