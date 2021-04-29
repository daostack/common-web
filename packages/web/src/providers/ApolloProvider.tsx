import React, { PropsWithChildren } from 'react';

import { ApolloProvider as BareApolloProvider } from '@apollo/client';
import { useApollo } from '../hooks';
import { useAuthContext } from '../context';

export const ApolloProvider: React.FC<PropsWithChildren<any>> = ({ children, ...rest }) => {
  const authContext = useAuthContext();
  console.log('authContext',authContext)
  const apollo = useApollo('http://localhost:4000/graphql' || '', authContext.token || '');

  return (
    <BareApolloProvider client={apollo}>
      {React.isValidElement(children) && React.cloneElement(children, { ...rest })}
    </BareApolloProvider>
  );
};