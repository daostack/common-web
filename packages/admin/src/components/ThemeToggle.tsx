import { Button } from '@geist-ui/react';
import { Sun, Moon } from '@geist-ui/react-icons';

import React from 'react';
import { useThemeMode } from '@hooks';

export const ThemeToggle: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useThemeMode();

  return (
    // <Button
    //   onClick={() => {
    //     setSelectedTheme(
    //       selectedTheme === 'light'
    //         ? 'dark'
    //         : 'light'
    //     );
    //   }}
    //   icon={selectedTheme === 'light'
    //     ? <Sun/>
    //     : <Moon/>
    //   }
    // >
    //   {selectedTheme}
    // </Button>
    <div />
  );
};