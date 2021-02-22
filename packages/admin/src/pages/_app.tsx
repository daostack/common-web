import 'firebase/auth';

import React from 'react';
import firebase from 'firebase/app';
import { AppProps } from 'next/app';

import { FirebaseAuthProvider } from '@react-firebase/auth';

import { CssBaseline, GeistProvider } from '@geist-ui/react';
import { AuthenticationBasedLayout } from '@components/layout/AuthenticationBasedLayout';
import { AuthContextProvider } from '@context';

const firebaseConfig = {
  apiKey: 'AIzaSyClh8UZh-PDyVgwPrHZwURoA4HWuiXUbR8',
  authDomain: 'common-staging-50741.firebaseapp.com',
  databaseURL: 'https://common-staging-50741.firebaseio.com',
  projectId: 'common-staging-50741',
  storageBucket: 'common-staging-50741.appspot.com',
  messagingSenderId: '78965953367',
  appId: '1:78965953367:android:257ae3c68f0101542f6412'
};

const CommonAdminApp = ({ Component, pageProps }: AppProps): React.ReactElement => {
  return (
    <GeistProvider themeType="dark">
      <CssBaseline/>

      {typeof window !== 'undefined' && (
        <AuthContextProvider>
          <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
            <AuthenticationBasedLayout>
              <Component {...pageProps} />
            </AuthenticationBasedLayout>
          </FirebaseAuthProvider>
        </AuthContextProvider>
      )}
    </GeistProvider>
  );
};

export default CommonAdminApp;
