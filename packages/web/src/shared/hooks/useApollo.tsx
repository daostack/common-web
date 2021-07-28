import React from "react";

import { createApolloClient } from "../utils";

const useApollo = (uri: string, token?: string) => {
  return React.useMemo(() => {
    return createApolloClient(uri, token);
  }, [uri, token]);
};

export default useApollo;
