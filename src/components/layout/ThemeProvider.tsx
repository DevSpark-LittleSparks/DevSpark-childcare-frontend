import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchSettings } from '../../features/settings/model/settingsSlice';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.settings?.theme || localStorage.getItem('app_theme') || 'light');
  const user = useSelector((state: RootState) => state.auth?.user);

  useEffect(() => {
    // If user is logged in, fetch settings from the backend
    if (user) {
      dispatch(fetchSettings() as any);
    }
  }, [user, dispatch]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return <>{children}</>;
};
