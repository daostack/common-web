import { AppProps } from 'next/app';
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { FirebaseAuthProvider } from '@react-firebase/auth';
import { AuthenticationBasedLayout } from '@components/layout/AuthenticationBasedLayout';
import { useRouter } from 'next/router';
import { ThemeProvider } from '@components/providers/ThemeProvider';

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
  const router = useRouter();
  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        router.push('/auth');
      } else {
        // sessionStorage.setItem('token', user.getIdToken(true).)

        localStorage.setItem('user.id', user.uid);
        localStorage.setItem('user.photoURL', user.photoURL);
      }
    });
  }, []);

  return (
    <React.Fragment>
      {typeof window !== 'undefined' && (
        <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
          <ThemeProvider>
            <AuthenticationBasedLayout>
              <Component {...pageProps} />
            </AuthenticationBasedLayout>
          </ThemeProvider>
        </FirebaseAuthProvider>
      )}
    </React.Fragment>
  );
};

export default CommonAdminApp;
