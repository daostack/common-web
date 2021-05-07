import React from 'react';
import { AppProps } from 'next/app';

import { IfFirebaseAuthed, IfFirebaseUnAuthed } from '@react-firebase/auth';
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

import { ClientOnly } from '@components/helpers';
import { UserContextProvider } from '@core/context';
import { AuthenticatedLayout } from '@components/layout/AuthenticatedLayout';
import { CommonApolloProvider, AuthenticationProvider } from '@components/providers';

import './../../public/style.css';


const CommonAdmin = ({ Component, pageProps }: AppProps): React.ReactElement => {
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
              {() => <Component {...pageProps} />}
            </IfFirebaseUnAuthed>
          </CommonApolloProvider>
        </AuthenticationProvider>
      </ClientOnly>
    </GeistProvider>
  );
};

export default CommonAdmin;
