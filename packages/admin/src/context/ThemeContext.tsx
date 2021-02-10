import React from 'react';

type IThemeContextValue = [theme: 'light' | 'dark', setTheme: (value: 'light' | 'dark') => void];

export const ThemeContext = React.createContext<IThemeContextValue>([
  'light',
  () => {}
]);

export const ThemeContextProvider = ThemeContext.Provider;
export const ThemeContextConsumer = ThemeContext.Consumer;