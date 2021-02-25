import React, { PropsWithChildren } from 'react';
import { Page, Spacer } from '@geist-ui/react';


import { PermissionsContextProvider, useAuthContext } from '@context';

import { ApolloProvider } from '@components/providers/ApolloProvider';
import { Header } from '@components/Header';

export const AuthenticationBasedLayout: React.FC<PropsWithChildren<any>> = ({ children, ...rest }) => {
  const authContext = useAuthContext();

  return (
    <React.Fragment>
      {authContext.loaded && (
        <React.Fragment>
          {(authContext.authenticated) ? (
            <ApolloProvider>
              <PermissionsContextProvider>
                <Page>
                  <Header />

                  <Page.Body style={{ paddingTop: 0 }}>
                    <Spacer y={1}/>

                    {React.isValidElement(children) && React.cloneElement(children, { ...rest })}
                  </Page.Body>
                </Page>
              </PermissionsContextProvider>
            </ApolloProvider>
          ) : (
            <React.Fragment>
              {React.isValidElement(children) && React.cloneElement(children, { ...rest })}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};