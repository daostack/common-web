import React from 'react';
import { AppProps } from 'next/app';

import { IfFirebaseAuthed, IfFirebaseUnAuthed } from '@react-firebase/auth';
import { CssBaseline, GeistProvider } from '@geist-ui/react';
import { ClientOnly } from '@components/helpers';
import { UserContextProvider } from '@core/context';
import { AuthenticatedLayout } from '@components/layout/AuthenticatedLayout';
import { CommonApolloProvider, AuthenticationProvider } from '@components/providers';

import './../../public/style.css';
import NProgress from 'nprogress';
import { Router } from 'next/router';

const firebaseConfig = {
  apiKey: process.env['NEXT_PUBLIC_Firebase.apiKey'],
  authDomain: process.env['NEXT_PUBLIC_Firebase.authDomain'],
  databaseURL: process.env['NEXT_PUBLIC_Firebase.databaseURL'],
  projectId: process.env['NEXT_PUBLIC_Firebase.projectId'],
  storageBucket: process.env['NEXT_PUBLIC_Firebase.storageBucket'],
  messagingSenderId: process.env['NEXT_PUBLIC_Firebase.messagingSenderId'],
  appId: process.env['NEXT_PUBLIC_Firebase.appId']
};


const CommonAdmin = ({ Component, pageProps }: AppProps): React.ReactElement => {
  React.useEffect(() => {
    NProgress.configure({ showSpinner: true });

    Router.events.on('routeChangeStart', () => {
      // console.log('onRouteChangeStart triggered');
      NProgress.start();
    });

    Router.events.on('routeChangeComplete', () => {
      NProgress.done();
    });

    Router.events.on('routeChangeError', () => {
      NProgress.done();
    });
  }, []);

  return (
    <GeistProvider>
      <CssBaseline/>

      <ClientOnly>
        <AuthenticationProvider>
          <CommonApolloProvider>
            <IfFirebaseAuthed>
              {() => (
                <UserContextProvider>
                  <AuthenticatedLayout>
                    <Component {...pageProps} />
                  </AuthenticatedLayout>
                </UserContextProvider>
              )}
            </IfFirebaseAuthed>

            <IfFirebaseUnAuthed>
              {({ firebase }) => (
                <React.Fragment>
                  {(Object.keys(firebase || {}).length > 0) && (
                    <Component {...pageProps} />
                  )}
                </React.Fragment>
              )}
            </IfFirebaseUnAuthed>
          </CommonApolloProvider>
        </AuthenticationProvider>
      </ClientOnly>
    </GeistProvider>
  );
};

export default CommonAdmin;
