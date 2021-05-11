import React from 'react';
import { CheckInCircle, XCircle } from '@geist-ui/react-icons';

interface StatusIconProps {
  valid: boolean;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ valid }) => {
  return (
    <React.Fragment>
      {valid ? (
        <CheckInCircle color="green" strokeWidth={2}/>
      ) : (
        <XCircle color="red" strokeWidth={2}/>
      )}
    </React.Fragment>
  );
};