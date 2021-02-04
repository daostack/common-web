import { RouterState } from "connected-react-router";

import { AuthStateType } from "../../containers/Auth/interface";
import { SharedStateType } from "./SharedState";

export interface AppState {
  auth: AuthStateType;
  router: RouterState;
  shared: SharedStateType;
}
