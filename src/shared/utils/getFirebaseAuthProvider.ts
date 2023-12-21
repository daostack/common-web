import { AuthProvider } from "@/shared/constants";
import firebase from "./firebase";

export const getFirebaseAuthProvider = (
  authProvider: AuthProvider,
): firebase.auth.GoogleAuthProvider | firebase.auth.OAuthProvider => {
  switch (authProvider) {
    case AuthProvider.Apple: {
      const provider = new firebase.auth.OAuthProvider("apple.com");
      provider.addScope("email");
      provider.addScope("name");

      return provider;
    }
    case AuthProvider.Facebook:
      return new firebase.auth.FacebookAuthProvider();
    default:
      return new firebase.auth.GoogleAuthProvider();
  }
};
