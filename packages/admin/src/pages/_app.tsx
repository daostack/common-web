import 'firebase/auth';

import React from 'react';
import firebase from 'firebase/app';
import { AppProps } from 'next/app';

import { FirebaseAuthProvider } from '@react-firebase/auth';

import { CssBaseline, GeistProvider } from '@geist-ui/react';
import { AuthenticationBasedLayout } from '@components/layout/AuthenticationBasedLayout';
import { AuthContextProvider } from '@context';

const firebaseConfig = {
  apiKey: process.env['NEXT_PUBLIC_Firebase.apiKey'],
  authDomain: process.env['NEXT_PUBLIC_Firebase.authDomain'],
  databaseURL: process.env['NEXT_PUBLIC_Firebase.databaseURL'],
  projectId: process.env['NEXT_PUBLIC_Firebase.projectId'],
  storageBucket: process.env['NEXT_PUBLIC_Firebase.storageBucket'],
  messagingSenderId: process.env['NEXT_PUBLIC_Firebase.messagingSenderId'],
  appId: process.env['NEXT_PUBLIC_Firebase.appId']
};

const CommonAdminApp = ({ Component, pageProps }: AppProps): React.ReactElement => {
  return (
    <GeistProvider>
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
