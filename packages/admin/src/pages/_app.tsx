import { CssBaseline, GeistProvider, Page, Tabs, User, Grid, Tooltip, Divider } from '@geist-ui/react';
import { AppProps } from 'next/app';
import React from 'react';
import { useRouter } from 'next/router';

const CommonAdminApp = ({ Component, pageProps }: AppProps): React.ReactElement => {
  // State
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
    <GeistProvider>
      <CssBaseline/>

      <Page dotBackdrop>
        <Page.Header>
          <Grid.Container style={{ marginTop: 15 }}>
            <Grid xs={12}/>
            <Grid xs={12} justify="flex-end" style={{ display: 'flex' }}>
              <Tooltip text={'Someday here you will find settings'} trigger="click" placement="bottomEnd">
                <User
                  src="https://lh3.googleusercontent.com/a-/AOh14GgaBxrLDOb-f5M1KCWmV6u39I_8hZQr3FGzSwEMLZc=s96-c"
                  name={null}
                />
              </Tooltip>
            </Grid>
          </Grid.Container>

          <Tabs value={currentTab} onChange={onTabChange} hideDivider>
            <Tabs.Item value="dashboard" label="Dashboard"/>
            <Tabs.Item value="commons" label="Commons"/>
            <Tabs.Item value="proposals" label="Proposals"/>
            <Tabs.Item value="payouts" label="Payouts"/>
            <Tabs.Item value="events" label="Events"/>
          </Tabs>
        </Page.Header>

        <Page.Body style={{ paddingTop: 0 }}>
          <Component {...pageProps} />
        </Page.Body>
      </Page>
    </GeistProvider>
  );
};

export default CommonAdminApp;
