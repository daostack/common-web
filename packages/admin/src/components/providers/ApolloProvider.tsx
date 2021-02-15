import React, { PropsWithChildren } from 'react';

import { ApolloProvider as BareApolloProvider } from '@apollo/client';
import { useApollo } from '@hooks';
import { useAuthContext } from '@context';

export const ApolloProvider: React.FC<PropsWithChildren<any>> = ({ children, ...rest }) => {
  const authContext = useAuthContext();
  const apollo = useApollo(process.env.NEXT_PUBLIC_ADMIN_GRAPH_ENDPOINT, authContext.token);

  return (
    <BareApolloProvider client={apollo}>
      {React.isValidElement(children) && React.cloneElement(children, { ...rest })}
    </BareApolloProvider>
  );
};