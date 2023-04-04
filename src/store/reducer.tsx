import { connectRouter } from "connected-react-router";
import { History } from "history";
import { AnyAction, combineReducers } from "redux";
import { AuthReducer } from "../pages/Auth/store/reducer";
import { commonsReducer } from "../pages/OldCommon/store";
import { trusteeReducer } from "../pages/Trustee/store";
import { AppState } from "../shared/interfaces";
import { SharedReducer } from "../shared/store/reducer";
import {
  cacheReducer,
  commonReducer,
  commonLayoutReducer,
  projectsReducer,
} from "./states";

export default (history: History) => {
  const appReducer = combineReducers<AppState>({
    auth: AuthReducer,
    shared: SharedReducer,
    commons: commonsReducer,
    router: connectRouter(history),
    trustee: trusteeReducer,
    projects: projectsReducer,
    common: commonReducer,
    commonLayout: commonLayoutReducer,
    cache: cacheReducer,
  });

  return (state: AppState | undefined, action: AnyAction) => {
    return appReducer(state, action);
  };
};
