import React, { useState } from 'react';
import { useTheme } from '@geist-ui/react';

export const Hoverable: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  // Hooks
  const { palette } = useTheme();

  // State
  const [h, setH] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        backgroundColor: h
          ? palette.accents_1
          : palette.background,

        borderRadius: 8,
        padding: 8
      }}
    >
      {children}
    </div>
  );
};