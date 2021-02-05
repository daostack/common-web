export interface GoogleAuthInterface {
  _provider: string;
  _profile: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicURL: string;
  };
  _token: {
    accessToken: string;
    idToken: string;
    scope: string;
    expiresIn: number;
    firstIssued_at: number;
    expiresAt: number;
  };
}
