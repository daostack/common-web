import { CssBaseline, GeistProvider, Page, Tabs, Text, User, Grid, Tooltip, Divider, Spacer } from '@geist-ui/react';
import { AppProps } from 'next/app';
import React from 'react';
import { useRouter } from 'next/router';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ThemeContextConsumer, ThemeContextProvider } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

let apolloClient;

const createApolloClient = (uri: string) => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri, // Server URL (must be absolute)
      credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
    }),
    cache: new InMemoryCache()
  });
};

export function initializeApollo(initialState = null, uri: string) {
  const _apolloClient = apolloClient ?? createApolloClient(uri);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState, uri: string) {
  return React.useMemo(() => initializeApollo(initialState, uri), [initialState, uri]);
}

const CommonAdminApp = ({ Component, pageProps }: AppProps): React.ReactElement => {
  console.log(process.env.NEXT_PUBLIC_ADMIN_GRAPH_ENDPOINT)

  const apolloClient = useApollo(pageProps.initialApolloState, process.env.NEXT_PUBLIC_ADMIN_GRAPH_ENDPOINT);

  // State
  const themeHook = React.useState<'light' | 'dark'>('light');
  const [currentTab, setCurrentTab] = React.useState<string>('dashboard');

  // Hooks
  const router = useRouter();

  // Effects
  React.useEffect(() => {
    setCurrentTab(router.pathname.split('/')[1]);
  });

  // Actions
  const onTabChange = (value: string): void => {
    setCurrentTab(value);

    router.push(`/${value}`);
  };

  return (
    <ThemeContextProvider value={themeHook}>
      <ThemeContextConsumer>
        {([theme]) => (
          <ApolloProvider client={apolloClient}>
            <GeistProvider theme={{ type: theme }}>
              <CssBaseline/>

              <Page dotBackdrop>
                <Page.Header>
                  <Grid.Container style={{ marginTop: 15 }}>
                    <Grid xs={12}>
                      <Text h2>Common Admin</Text>
                    </Grid>
                    <Grid xs={12} justify="flex-end" style={{ display: 'flex' }}>
                      <Tooltip text={(
                        <React.Fragment>
                          <Divider align="start">
                            Settings
                          </Divider>

                          <ThemeToggle />
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

                  <Component {...pageProps} />
                </Page.Body>
              </Page>
            </GeistProvider>
          </ApolloProvider>
        )}
      </ThemeContextConsumer>
    </ThemeContextProvider>
  );
};

export default CommonAdminApp;
