import React, { PropsWithChildren } from "react";
import { ApolloProvider as BareApolloProvider } from "@apollo/client";

import { useApollo } from "../hooks";
import { useAuthContext } from "../context";
import { GRAPH_QL_URL } from "../constants";

export const ApolloProvider: React.FC<PropsWithChildren<any>> = ({ children, ...rest }) => {
  const authContext = useAuthContext();
  const apollo = useApollo(GRAPH_QL_URL || "", authContext.token || "");

  return (
    <BareApolloProvider client={apollo}>
      {React.isValidElement(children) && React.cloneElement(children, { ...rest })}
    </BareApolloProvider>
  );
};
