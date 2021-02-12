import React from 'react';
import { useSystemTheme } from './useSystemTheme';
import { useLocalStorage } from './useLocalStorage';

export type ThemeModes = 'light' | 'dark';

const themeKey = 'common.theme.mode';

const getKey = <T>(key: string, defaultValue?: T): T => {
  const value = typeof window !== 'undefined' && (JSON.parse(localStorage.getItem(key)) as T);

  return value || defaultValue;
};

const setKey = <T>(key: string, value: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const useThemeMode = (): [ThemeModes, (theme: ThemeModes) => void] => {
  const systemTheme = useSystemTheme('light');
  // const [themeMode, setThemeModeState] = React.useState<ThemeModes>(getKey<ThemeModes>(themeKey, systemTheme));
  const [themeMode, setThemeModeState] = useLocalStorage('common.theme.themeMode')

  const setThemeMode = (themeMode: ThemeModes): void => {
    setKey(themeKey, themeMode);
    setThemeModeState(themeMode);
  };

  return [themeMode as ThemeModes, setThemeMode];
};