import { Button } from '@geist-ui/react';
import { Sun, Moon } from '@geist-ui/react-icons'

import React from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const [themeMode, setThemeMode] = React.useContext(ThemeContext);

  return (
    <Button
      onClick={() => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
      }}
      icon={themeMode === 'light'
        ? <Sun />
        : <Moon />
      }
    >
      {themeMode}
    </Button>
  );
};