import { produce } from "immer";
import { ActionType, createReducer } from "typesafe-actions";

import { AuthStateType } from "../interface";
// import { tokenHandler } from "../../../shared/utils";
import * as actions from "./actions";

type Action = ActionType<typeof actions>;

const initialState: AuthStateType = {
  authentificated: true,
  user: null,
};

const reducer = createReducer<AuthStateType, Action>(initialState).handleAction(actions.socialLogin.success, (state) =>
  produce(state, (nextState) => {
    nextState.authentificated = true;
  }),
);

export { reducer as AuthReducer };
