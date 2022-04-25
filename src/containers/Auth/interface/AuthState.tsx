import { AuthProvider } from "../../../shared/constants";
import { User } from "../../../shared/models";
import { LoginModalState } from "../../Auth/interface";

export interface AuthStateType {
  user: User | null;
  userPhoneNumber: string | null;
  authentificated: boolean;
  loginModalState: LoginModalState;
  isAuthLoading: boolean;
  authProvider: AuthProvider | null;
  isAuthenticationReady: boolean;
}
