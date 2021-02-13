import React, { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';

import firebase from 'firebase/app';
import { Grid, Page, Spacer, Tabs, Tooltip, User, Text } from '@geist-ui/react';

import { ApolloProvider } from '@components/providers/ApolloProvider';
import { PermissionsContextProvider, useAuthContext } from '@context';
import { HasPermission } from '@components/HasPermission';

export const AuthenticationBasedLayout: React.FC<PropsWithChildren<any>> = ({ children, ...rest }) => {
  const [currentTab, setCurrentTab] = React.useState<string>('dashboard');
  const authContext = useAuthContext();

  // Hooks
  const router = useRouter();

  // Effects
  React.useEffect(() => {
    setCurrentTab(router.pathname.split('/')[1]);
  });

  React.useEffect(() => {
    if (authContext.loaded) {
      if (!authContext.authenticated && router.pathname !== '/auth') {
        router.push('/auth');
      }
    }
  }, [authContext]);

  // Actions
  const onTabChange = (value: string): void => {
    setCurrentTab(value);

    router.push(`/${value}`);
  };

  const onSignOut = async (): Promise<void> => {
    await firebase.auth().signOut();

    router.push('/');
  };

  return (
    <React.Fragment>
      {authContext.loaded && (
        <React.Fragment>
          {(authContext.authenticated) ? (
            <ApolloProvider>
              <PermissionsContextProvider>
                <Page>
                  <HasPermission permission="admin.*">
                    <Page.Header>
                      <Grid.Container style={{ marginTop: 15 }}>
                        <Grid xs={12}>
                          <Text h2>Common Admin</Text>
                        </Grid>
                        <Grid xs={12} justify="flex-end" style={{ display: 'flex' }}>
                          <Tooltip text={(
                            <React.Fragment>
                              <Text onClick={onSignOut}>Sign Out</Text>
                            </React.Fragment>
                          )} trigger="click" placement="bottomEnd">
                            <User
                              src={authContext.userInfo?.photoURL}
                              name={authContext.userInfo.displayName}
                            />
                          </Tooltip>
                        </Grid>
                      </Grid.Container>

                      <Tabs value={currentTab} onChange={onTabChange} hideDivider>
                        <Tabs.Item value="dashboard" label="Dashboard"/>
                        <Tabs.Item value="commons" label="Commons"/>
                        <Tabs.Item value="proposals" label="Proposals"/>
                        <Tabs.Item value="users" label="Users"/>
                        <Tabs.Item value="payouts" label="Payouts"/>
                        <Tabs.Item value="events" label="Events"/>
                      </Tabs>
                    </Page.Header>
                  </HasPermission>

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