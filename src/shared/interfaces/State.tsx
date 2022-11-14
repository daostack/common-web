import { RouterState } from "connected-react-router";
import { AuthStateType } from "../../pages/Auth/interface";
import { CommonsStateType } from "../../pages/OldCommon/interfaces";
import { TrusteeStateType } from "../../pages/Trustee/interfaces";
import { SharedStateType } from "./SharedState";

export interface AppState {
  auth: AuthStateType;
  router: RouterState;
  shared: SharedStateType;
  commons: CommonsStateType;
  trustee: TrusteeStateType;
}
