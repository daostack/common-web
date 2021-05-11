import React from 'react';
import { CheckInCircle, XCircle } from '@geist-ui/react-icons';
import { Centered } from '@components/Centered';

interface StatusIconProps {
  valid: boolean;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ valid }) => {
  return (
    <Centered>
      {valid ? (
        <CheckInCircle color="green" strokeWidth={2}/>
      ) : (
        <XCircle color="red" strokeWidth={2}/>
      )}
    </Centered>
  );
};