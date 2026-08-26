import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import academicReducer from './slices/academicSlice';
import authReducer     from './slices/authSlice';
import billingReducer  from './slices/billingSlice';
import chatbotReducer  from './slices/chatbotSlice';
import healthReducer   from './slices/healthSlice';
import progressReducer from './slices/progressSlice';
import staffReducer    from './slices/staffSlice';
import teacherReducer  from './slices/teacherSlice';

export const store = configureStore({
  reducer: {
    academic: academicReducer,
    auth:     authReducer,
    billing:  billingReducer,
    chatbot:  chatbotReducer,
    health:   healthReducer,
    progress: progressReducer,
    staff:    staffReducer,
    teacher:  teacherReducer,
  },
  devTools: true,
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;