import { AuthProviderID } from "../constants";

export interface FirebaseCredentials {
    redirectUrl: string;
    providerId: AuthProviderID;
    signInMethod: AuthProviderID;
    idToken: string;
    accessToken: string;
    secret: string;
    rawNonce?: string;
    isLoggedIn: string;
}