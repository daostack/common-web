import React from 'react';
import { gql } from '@apollo/client';

import { useLoadUserContextQuery } from '@core/graphql';

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
  const { data } = useLoadUserContextQuery();

  // Effects
  React.useEffect(() => {
    console.log(data);

    if (data) {
      setContext({
        loaded: true,
        ...data.user
      });
    }
  }, [data]);

  // Render
  return (
    <UserContext.Provider value={context}>
      {children}
    </UserContext.Provider>
  );
};