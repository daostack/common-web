import React, { PropsWithChildren } from 'react';

import firebase from 'firebase/app';
import { AuthEmission } from '@react-firebase/auth/dist/types';
import { InMemoryCache, ApolloProvider as BareApolloProvider, ApolloClient, HttpLink } from '@apollo/client';
import { setContext } from 'apollo-link-context';

const createApolloClient = (uri: string) => {
  const baseLink = new HttpLink({
    uri
  });

  const withToken = setContext(async (request) => {
    return {
      headers: {
        authorization: await firebase.auth().currentUser.getIdToken()
      }
    };
  });


  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    // link: new HttpLink({
    //   uri, // Server URL (must be absolute)
    //   credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    //   headers: {
    //     authorization: token
    //   }
    // }),
    cache: new InMemoryCache(),
    link: withToken.concat(baseLink as any) as any
  });
};

const useApollo = (initialState: any, uri: string) => {
  return createApolloClient(uri);
};

interface IApolloProviderProps {
  auth: AuthEmission;
  token: string;
}

export const ApolloProvider: React.FC<PropsWithChildren<IApolloProviderProps>> = ({
                                                                                    auth,
                                                                                    children,
                                                                                    ...rest
                                                                                  }) => {
  const apollo = useApollo(null, process.env.NEXT_PUBLIC_ADMIN_GRAPH_ENDPOINT);

  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        apollo.clearStore();
      }
    });
  });

  return (
    <BareApolloProvider client={apollo}>
      {React.isValidElement(children) && React.cloneElement(children, { ...rest, auth })}
    </BareApolloProvider>
  );
};