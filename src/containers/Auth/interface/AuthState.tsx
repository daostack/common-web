import { AuthProvider } from "../../../shared/constants";
import { User } from "../../../shared/models";

export interface AuthStateType {
  user: User | null;
  authentificated: boolean;
  isNewUser: boolean;
  isLoginModalShowing: boolean;
  authProvider: AuthProvider | null;
}
