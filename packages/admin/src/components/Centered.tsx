import React, { PropsWithChildren } from 'react';

interface ICenteredProps {
  content?: React.FC | React.ReactFragment;
}

type Props = ICenteredProps &  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Centered: React.FC<Props> = ({ children, content, ...props }) => {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }} {...props}>
      {content || children}
    </div>
  );
};