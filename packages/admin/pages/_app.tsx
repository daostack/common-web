import { CssBaseline, GeistProvider } from '@geist-ui/react';
import { AppProps } from 'next/app';
import React from 'react';

const CommonAdminApp = ({ Component, pageProps }: AppProps): React.ReactElement => {
  return (
    <GeistProvider>
      <CssBaseline/>
      <Component {...pageProps} />
    </GeistProvider>
  );
};

export default CommonAdminApp;
