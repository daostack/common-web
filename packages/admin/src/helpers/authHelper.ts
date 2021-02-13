import { init } from 'next-firebase-auth';

const firebaseConfig = {
  apiKey: 'AIzaSyClh8UZh-PDyVgwPrHZwURoA4HWuiXUbR8',
  authDomain: 'common-staging-50741.firebaseapp.com',
  databaseURL: 'https://common-staging-50741.firebaseio.com',
  projectId: 'common-staging-50741',
  storageBucket: 'common-staging-50741.appspot.com',
  messagingSenderId: '78965953367',
  appId: '1:78965953367:android:257ae3c68f0101542f6412'
};


const initAuth = () => {
  init({
    authPageURL: '/auth',
    appPageURL: '/dashboard',
    loginAPIEndpoint: '/api/login', // required
    logoutAPIEndpoint: '/api/logout', // required

    // Required in most cases.
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      },
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    },
    firebaseClientInitConfig: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // required
      authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    },
    cookies: {
      name: 'CommonCookie.Admin.Auth',
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 14 * 60 * 60 * 24 * 1000, // two weeks
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: true, // set this to false in local (non-HTTPS) development
      signed: false,
    },
  })
}

export default initAuth;