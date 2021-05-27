import React from 'react';
import { gql } from '@apollo/client';

import { useLoadUserContextQuery } from '@core/graphql';
import { Loading } from '@geist-ui/react';

interface UserContext {
  loaded: boolean;

  id?: string;

  firstName?: string;
  lastName?: string;

  displayName?: string;

  email?: string;
  photo?: string;

  permissions?: string[];
}

const defaultUserContext: UserContext = {
  loaded: false
};

const UserContext = React.createContext<UserContext>(defaultUserContext);

export const useUserContext = () => {
  return React.useContext(UserContext);
};

const LoadUserContextQuery = gql`
  query loadUserContext {
    user {
      id

      firstName
      lastName

      displayName

      email
      photo

      permissions
    }
  }
`;

export const UserContextProvider: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  // State
  const [context, setContext] = React.useState<UserContext>(defaultUserContext);

  // Data Fetching
  const { data } = useLoadUserContextQuery({
    pollInterval: 5 * 60 * 1000 // Check every 5 minutes for update
  });

  // Effects
  React.useEffect(() => {
    if (data?.user) {
      setContext({
        loaded: true,
        ...data.user
      });

      console.log('User data and permissions loaded!');
    }
  }, [data]);

  // Render
  return (
    <UserContext.Provider value={context}>
      {context.loaded ? (
        <React.Fragment>
          {children}
        </React.Fragment>
      ) : (
        <Loading/>
      )}
    </UserContext.Provider>
  );
};