import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from '../features/auth/authSlice';
import surveyReducer from '../features/survey/surveySlice';
import responseReducer from '../features/response/responseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    survey: surveyReducer,
    response: responseReducer,
  },
});

// Types for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 