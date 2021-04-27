import React from 'react';
import { HasPermission } from '@components/HasPermission';

interface WithPermissionOptions {
  redirect?: boolean;
}

type WithPermissionReturn = (component: React.FC<any>) => React.FC<any>;

export const withPermission = (permission: string, options: WithPermissionOptions = {}): WithPermissionReturn => {
  return (Component) => {
    return () => (
      <HasPermission permission={permission} {...options}>
        <Component/>
      </HasPermission>
    );
  };
};