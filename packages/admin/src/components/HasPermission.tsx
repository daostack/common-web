import React, { PropsWithChildren } from 'react';

import { useRouter } from 'next/router';
import { useUserContext } from '@core/context';

interface IHasPermissionProps {
  permission: string;

  redirect?: boolean;
}

export const HasPermission: React.FC<PropsWithChildren<IHasPermissionProps>> = ({ children, permission, redirect }) => {
  const router = useRouter();
  const userContext = useUserContext();

  const hasPermission = (permission: string): boolean => {
    let hasPermission = false;

    if (userContext.loaded) {
      const permissions = userContext.permissions;

      if (permission.includes('*')) {
        hasPermission = permissions.some((userPermission) =>
          matchRuleExpl(userPermission, permission));
      } else {
        hasPermission = permissions.includes(permission);
      }
    }

    console.debug(`Permission check for [${permission}]: ${hasPermission}`);

    if (!hasPermission && redirect) {
      router
        .push({
          pathname: '/error/unauthorized',
          query: {
            redirected: true,
            redirectedFrom: router.pathname,
            failedPermission: permission
          }
        })
        .then(() => {
          console.log('Redirected unauthorized request');
        });
    }

    return hasPermission;
  };

  const matchRuleExpl = (str, rule) => {
    // for this solution to work on any string, no matter what characters it has
    const escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');

    // "."  => Find a single character, except newline or line terminator
    // ".*" => Matches any string that contains zero or more characters
    rule = rule.split('*').map(escapeRegex).join('.*');

    // "^"  => Matches any string with the following at the beginning of it
    // "$"  => Matches any string with that in front at the end of it
    rule = '^' + rule + '$';

    //Create a regular expression object for matching string
    const regex = new RegExp(rule);

    //Returns true if it finds a match, otherwise it returns false
    return regex.test(str);
  };


  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};