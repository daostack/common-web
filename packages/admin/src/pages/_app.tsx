import 'firebase/auth';
import React from 'react';

import { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { AuthenticationBasedLayout } from '@components/layout/AuthenticationBasedLayout';
import initAuth from '../helpers/authHelper';

initAuth();

const CommonAdminApp = ({ Component, pageProps }: AppProps): React.ReactElement => {
  return (
    <React.Fragment>
      {typeof window !== 'undefined' && (
        <AuthenticationBasedLayout>
          <Component {...pageProps} />
        </AuthenticationBasedLayout>
      )}
    </React.Fragment>
  );
};

export default CommonAdminApp;
