import { RouterState } from "connected-react-router";

import { AuthStateType } from "../../containers/Auth/interface";
import { SharedStateType } from "./SharedState";
import { CommonsStateType } from "../../containers/Common/interfaces";

export interface AppState {
  auth: AuthStateType;
  router: RouterState;
  shared: SharedStateType;
  commons: CommonsStateType;
}
