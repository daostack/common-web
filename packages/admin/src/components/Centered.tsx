import React, { PropsWithChildren } from 'react';

interface ICenteredProps {
  content: React.FC | React.ReactFragment;
}

export const Centered: React.FC<PropsWithChildren<ICenteredProps>> = ({ children, content }) => {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      {content || children}
    </div>
  );
};