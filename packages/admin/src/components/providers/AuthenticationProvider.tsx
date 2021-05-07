import 'firebase/auth';

import React from 'react';
import firebase from 'firebase/app';
import { useRouter } from 'next/router';
import { FirebaseAuthProvider, IfFirebaseUnAuthed, IfFirebaseAuthed } from '@react-firebase/auth';

import { Paths } from '@core/constants';
import { useAuthState } from 'react-firebase-hooks/auth';

const config = {
  apiKey: process.env['NEXT_PUBLIC_Firebase.ApiKey'],
  projectId: process.env['NEXT_PUBLIC_Firebase.ProjectId'],
  authDomain: process.env['NEXT_PUBLIC_Firebase.AuthDomain'],
  databaseURL: process.env['NEXT_PUBLIC_Firebase.DatabaseUrl']
};

export const AuthenticationProvider: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  return (
    <React.Fragment>
      <FirebaseAuthProvider firebase={firebase} {...config}>
        {children}

        <AuthenticationRedirection/>
      </FirebaseAuthProvider>
    </React.Fragment>
  );
};

const AuthenticationRedirection = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(firebase.auth());

  return (
    <React.Fragment>
      <IfFirebaseUnAuthed>
        {() => {
          // If the user is not authenticated and is not on the login
          // page redirect it to that page
          if (router.pathname !== Paths.auth.login && !loading) {
            router.push(Paths.auth.login)
              .then(() => {
                console.log(
                  'Redirected unauthenticated user ' +
                  'to the login page', loading, user, error
                );
              });
          }
        }}
      </IfFirebaseUnAuthed>

      <IfFirebaseAuthed>
        {() => {
          // If the user is authenticated and is on the login page
          // redirect it to the homepage
          if (router.pathname === Paths.auth.login) {
            router.push(Paths.dashboard)
              .then(() => {
                console.log(
                  'Redirected authenticated user away ' +
                  'from the login page'
                );
              });
          }
        }}
      </IfFirebaseAuthed>
    </React.Fragment>
  );
};