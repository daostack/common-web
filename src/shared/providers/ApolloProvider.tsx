import React, { PropsWithChildren } from "react";
import { ApolloProvider as BareApolloProvider } from "@apollo/client";

import { useApollo } from "../hooks";
import { useAuthContext } from "../context";

export const ApolloProvider: React.FC<PropsWithChildren<any>> = ({ children, ...rest }) => {
  const authContext = useAuthContext();
  const apollo = useApollo("https://api-test.staging.common.io/graphql" || "", authContext.token || "");

  return (
    <BareApolloProvider client={apollo}>
      {React.isValidElement(children) && React.cloneElement(children, { ...rest })}
    </BareApolloProvider>
  );
};
