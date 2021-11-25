import { User } from "../../../shared/models";

export interface AuthStateType {
  user: User | null;
  authentificated: boolean;
  isNewUser: boolean;
}
