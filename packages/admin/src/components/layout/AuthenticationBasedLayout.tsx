import React, { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';

import firebase from 'firebase/app';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { Divider, Grid, Page, Spacer, Tabs, Tooltip, User, Text } from '@geist-ui/react';

import { ThemeToggle } from '../ThemeToggle';
import { ApolloProvider } from '@components/providers/ApolloProvider';

export const AuthenticationBasedLayout: React.FC<PropsWithChildren<any>> = ({ children, ...rest }) => {
  const [currentTab, setCurrentTab] = React.useState<string>('dashboard');
  const [token, setToken] = React.useState<string>();

  // Hooks
  const router = useRouter();

  // Effects
  React.useEffect(() => {
    setCurrentTab(router.pathname.split('/')[1]);
  });

  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken(true);

        setToken(idToken);
      }
    });
  }, []);

  // Actions
  const onTabChange = (value: string): void => {
    setCurrentTab(value);

    router.push(`/${value}`);
  };

  const onSignOut = async (): Promise<void> => {
    await firebase.auth().signOut();

    localStorage && localStorage.clear();
  };

  return (
    <FirebaseAuthConsumer>
      {(auth) => (
        <React.Fragment>
          {auth.isSignedIn ? (
            <React.Fragment>
              {token && (
                <ApolloProvider auth={auth} token={token}>
                  <Page dotBackdrop>
                    <Page.Header>
                      <Grid.Container style={{ marginTop: 15 }}>
                        <Grid xs={12}>
                          <Text h2>Common Admin</Text>
                        </Grid>
                        <Grid xs={12} justify="flex-end" style={{ display: 'flex' }}>
                          <Tooltip text={(
                            <React.Fragment>

                              <ThemeToggle/>

                              <Text onClick={onSignOut}>Sign Out</Text>
                            </React.Fragment>
                          )} trigger="click" placement="bottomEnd">
                            <User
                              src="https://scontent.fsof8-1.fna.fbcdn.net/v/t1.0-9/125179462_843039883183225_644338599158826343_n.jpg?_nc_cat=103&ccb=3&_nc_sid=09cbfe&_nc_ohc=9zaPQ_Y0wqYAX-AutYn&_nc_ht=scontent.fsof8-1.fna&oh=505127f70c6b832d6966f855a1048f10&oe=6048998C"
                              name={null}
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

                    <Page.Body style={{ paddingTop: 0 }}>
                      <Spacer y={1}/>

                      {React.isValidElement(children) && React.cloneElement(children, { ...rest, auth })}
                    </Page.Body>
                  </Page>
                </ApolloProvider>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {router.pathname === '/auth' && (
                React.isValidElement(children) && React.cloneElement(children, { ...rest, auth })
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </FirebaseAuthConsumer>
  );
};