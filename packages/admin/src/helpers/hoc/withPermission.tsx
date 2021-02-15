import { HasPermission } from '@components/HasPermission';
import React from 'react';

interface IWithPermissionOptions {
  redirect?: boolean;
}

export const withPermission = (permission: string, options: IWithPermissionOptions = {})
  : (component: React.FC<any>) => React.FC<any> => {
  return (Component) => {
    return () => (
      <HasPermission permission={permission} {...options}>
        <Component/>
      </HasPermission>
    );
  };
};