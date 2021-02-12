import { CssBaseline, GeistProvider } from '@geist-ui/react';
import React, { PropsWithChildren } from 'react';
import { useSystemTheme } from '../../hooks/useSystemTheme';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const ThemeProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  // const systemTheme = useSystemTheme();
  // const [theme] = useLocalStorage('common.theme.themeMode', systemTheme);

  return (
    <GeistProvider theme={{ type: 'light' }}>
      <CssBaseline/>

      {children}
    </GeistProvider>
  );
}