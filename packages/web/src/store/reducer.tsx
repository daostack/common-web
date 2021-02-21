import { AnyAction, combineReducers } from "redux";
import { History } from "history";
import { connectRouter } from "connected-react-router";

import { AuthReducer } from "../containers/Auth/store/reducer";
import { AppState } from "../shared/interfaces/State";
import { SharedReducer } from "../shared/store/reducer";
import { commonsReducer } from "../containers/Common/store";

export default (history: History) => {
  const appReducer = combineReducers({
    auth: AuthReducer,
    shared: SharedReducer,
    commons: commonsReducer,
    router: connectRouter(history),
  });

  return (state: AppState | undefined, action: AnyAction) => {
    return appReducer(state, action);
  };
};
