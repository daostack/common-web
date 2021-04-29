import React from 'react';
import { createApolloClient } from '../helpers/apolloHelper';

export const useApollo = (uri: string, token?: string) => {
  return React.useMemo(() => {
    return createApolloClient(uri, token)
  }, [uri, token]);
};
