import React from 'react';
import { createApolloClient } from '@helpers';

export const useApollo = (uri: string, token?: string) => {
  return React.useMemo(() => {
    return createApolloClient(uri, token)
  }, [uri, token]);
};
