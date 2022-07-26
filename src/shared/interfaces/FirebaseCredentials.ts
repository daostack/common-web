import { AuthProviderID } from "../constants";

export interface FirebaseCredentials {
    providerId: AuthProviderID;
    signInMethod: AuthProviderID;
    idToken: string;
    accessToken: string;
    secret: string;
    rawNonce?: string;
}