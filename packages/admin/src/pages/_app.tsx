import { CssBaseline, GeistProvider, Page, Tabs } from '@geist-ui/react';
import { AppProps } from 'next/app';
import React from 'react';

const CommonAdminApp = ({ Component, pageProps }: AppProps): React.ReactElement => {
  const [currentTab, setCurrentTab] = React.useState<string>('dashboard');

  const onTabChange = () => {

  }

  return (
    <GeistProvider>
      <CssBaseline/>

      <Page dotBackdrop>
        <Page.Header>
          <Tabs value={currentTab} onChange={onTabChange}>

          </Tabs>
        </Page.Header>

        <Page.Body>
          <Component {...pageProps} />
        </Page.Body>
      </Page>
    </GeistProvider>
  );
};

export default CommonAdminApp;
