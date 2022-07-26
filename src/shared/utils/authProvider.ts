import { AuthProviderID } from "../constants";
import firebase from '@/shared/utils/firebase';

export function getProvider(provider: AuthProviderID) {
    switch(provider) {
        case AuthProviderID.Google:
            return firebase.auth.GoogleAuthProvider;
            break;
        case AuthProviderID.Facebook:
            return firebase.auth.FacebookAuthProvider;
            break;
        default:
            return firebase.auth.GoogleAuthProvider;
            break;
    }
}