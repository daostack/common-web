import { connectRouter } from "connected-react-router";
import { History } from "history";
import { AnyAction, combineReducers } from "redux";
import { AuthReducer } from "../pages/Auth/store/reducer";
import { commonsReducer } from "../pages/Common/store";
import { trusteeReducer } from "../pages/Trustee/store";
import { AppState } from "../shared/interfaces";
import { SharedReducer } from "../shared/store/reducer";

export default (history: History) => {
  const appReducer = combineReducers<AppState>({
    auth: AuthReducer,
    shared: SharedReducer,
    commons: commonsReducer,
    router: connectRouter(history),
    trustee: trusteeReducer,
  });

  return (state: AppState | undefined, action: AnyAction) => {
    return appReducer(state, action);
  };
};
