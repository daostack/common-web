import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "apollo-link-context";

export const createApolloClient = (uri: string, token?: string) => {
  const baseLink = new HttpLink({
    uri,
  });

  const withToken = setContext(async () => {
    return {
      headers: {
        authorization: token,
      },
    };
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    cache: new InMemoryCache(),
    link: withToken.concat(baseLink as any) as any,
  });
};
