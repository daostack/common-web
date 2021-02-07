export interface User {
  apiKey: string;
  appName: string;
  authDomain: string;
  createdAt: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  lastLoginAt: string;

  phoneNumber: null | string;
  photoURL: string;

  stsTokenManager: {
    apiKey: string;
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
  };

  uid: string;
}
