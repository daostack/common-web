import React, { PropsWithChildren } from 'react';

interface ICenteredProps {
  content?: React.FC | React.ReactFragment;

  vertical?: boolean;
}

type Props = ICenteredProps &  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Centered: React.FC<Props> = ({ children, vertical, content, ...props }) => {
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      ...(vertical && ({
        height: '100%',
        alignItems: 'center'
      }))
    }} {...props}>
      {content || children}
    </div>
  );
};