import { gql } from '@apollo/client';
import React, { PropsWithChildren } from 'react';
import { useAuthContext } from './AuthContext';
import { useGetUserPermissionsQuery } from '../graphql';

interface IPermissionsContext {
  loaded: boolean;
  permissions: any;
}

const defaultPermissionsContext: IPermissionsContext = {
  loaded: false,
  permissions: []
};

const PermissionsContext = React.createContext<IPermissionsContext>(defaultPermissionsContext);

export const usePermissionsContext = () => {
  return React.useContext(PermissionsContext);
};

const LoadPermissionsQuery = gql`
  query getUserPermissions($userId: ID!) {
    user(id: $userId) {
      permissions
    }
  }
`;

export const PermissionsContextProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const authContext = useAuthContext();

  const { data, loading } = useGetUserPermissionsQuery({
    skip: !authContext.loaded && !authContext.authenticated,
    pollInterval: 120 * 1000,
    variables: {
      userId: authContext.userInfo?.uid || ''
    }
  });

  const [context, setContext] = React.useState<IPermissionsContext>(defaultPermissionsContext);

  React.useEffect(() => {
    if (authContext.authenticated && data?.user) {
      setContext({
        loaded: true,
        permissions: data.user?.permissions
      });
    } else {
      setContext({
        loaded: !loading && authContext.authenticated || false,
        permissions: []
      });
    }
  }, [authContext, data, loading]);

  return (
    <PermissionsContext.Provider value={context}>
      {children}
    </PermissionsContext.Provider>
  );
};