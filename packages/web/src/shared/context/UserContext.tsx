import React from "react";
import { Loader } from "../components";
import { useLoadUserContextQuery } from "../../graphql";

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
  loaded: false,
};

const UserContext = React.createContext<UserContext>(defaultUserContext);

export const useUserContext = () => {
  return React.useContext(UserContext);
};

export const UserContextProvider: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  // State
  const [context, setContext] = React.useState<UserContext>(defaultUserContext);

  // Data Fetching
  const { data } = useLoadUserContextQuery();

  // Effects
  React.useEffect(() => {
    if (data?.user) {
      setContext({
        loaded: true,
        ...data.user,
      });
    }
  }, [data]);

  // Render
  return (
    <UserContext.Provider value={context}>
      {context.loaded ? <React.Fragment>{children}</React.Fragment> : <Loader />}
    </UserContext.Provider>
  );
};
