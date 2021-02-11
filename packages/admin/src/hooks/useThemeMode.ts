import React from 'react';

type ThemeModes = 'light' | 'dark';

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
  const [themeMode, setThemeModeState] = React.useState<ThemeModes>(getKey<ThemeModes>(themeKey, 'light'));

  const setThemeMode = (themeMode: ThemeModes): void => {
    setKey(themeKey, themeMode);
    setThemeModeState(themeMode);
  };

  return [themeMode, setThemeMode];
};