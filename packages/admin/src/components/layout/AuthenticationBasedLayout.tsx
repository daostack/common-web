import React, { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';

import firebase from 'firebase/app';
import { Page, Spacer, Tabs, Tooltip, Link, Text, Avatar } from '@geist-ui/react';

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
                  <Page.Header>
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignContent: 'center',
                        marginTop: 10
                      }}
                    >
                      <Text h6 style={{ margin: 0 }}>{authContext.userInfo.displayName}</Text>
                      <Tooltip
                        trigger="click"
                        placement="bottomEnd"
                        text={(
                          <div style={{ minWidth: '10vw' }}>
                            <Link onClick={onSignOut}>
                              <b>Sign Out</b>
                            </Link>
                          </div>
                        )}
                        style={{
                          marginLeft: 10
                        }}
                      >
                        <div style={{ cursor: 'pointer' }}>
                          <Avatar src={authContext.userInfo.photoURL}/>
                        </div>
                      </Tooltip>
                    </div>

                    <HasPermission permission="admin.*">
                      <Tabs value={currentTab} onChange={onTabChange} hideDivider>
                        <Tabs.Item value="dashboard" label="Dashboard"/>
                        <Tabs.Item value="commons" label="Commons"/>
                        <Tabs.Item value="proposals" label="Proposals"/>
                        <Tabs.Item value="users" label="Users"/>
                        <Tabs.Item value="payouts" label="Payouts"/>
                        <Tabs.Item value="events" label="Events"/>
                      </Tabs>
                    </HasPermission>
                  </Page.Header>

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