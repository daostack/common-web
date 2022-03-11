import { AuthProvider } from "../../../shared/constants";
import { User } from "../../../shared/models";

export interface AuthStateType {
  user: User | null;
  userPhoneNumber: string | null;
  authentificated: boolean;
  isLoginModalShowing: boolean;
  isAuthLoading: boolean;
  authProvider: AuthProvider | null;
}
