import React from 'react';

import { setContext } from '@apollo/client/link/context';
import { ApolloClient, InMemoryCache, ApolloProvider, ApolloLink, HttpLink } from '@apollo/client';

import firebase from 'firebase/app';

const cache = new InMemoryCache();

const authLink = setContext(async (_, { headers }) => {
  const token = await firebase.auth()
    .currentUser
    .getIdToken();

  return {
    headers: {
      ...headers,
      authorization: token
    }
  };
});

const generateClient = () => {
  const links: any[] = [
    authLink
  ];

  console.log('Creating GraphQL Client');

  return new ApolloClient({
    cache,
    link: ApolloLink.from([
      ...links,
      new HttpLink({
        uri: process.env['NEXT_PUBLIC_GraphQl.Endpoint'] as string
      })
    ])
  });
};

const client = generateClient();

export const CommonApolloProvider: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};