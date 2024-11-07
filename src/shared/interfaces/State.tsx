import { RouterState } from "connected-react-router";
import {
  CacheState,
  CommonState,
  CommonLayoutState,
  InboxState,
  ProjectsState,
  ChatState,
  CommonFeedFollowsState,
  MultipleSpacesLayoutState,
  OptimisticState
} from "@/store/states";
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
  projects: ProjectsState;
  common: CommonState;
  commonLayout: CommonLayoutState;
  commonFeedFollows: CommonFeedFollowsState;
  cache: CacheState;
  chat: ChatState;
  inbox: InboxState;
  multipleSpacesLayout: MultipleSpacesLayoutState;
  optimistic: OptimisticState;
}
