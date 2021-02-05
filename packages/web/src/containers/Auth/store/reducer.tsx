import produce from "immer";

import { AuthStateType } from "../interface";
import { tokenHandler } from "../../../shared/utils";
import * as actions from "./actions";
import { ActionType, createReducer } from "typesafe-actions";

type Action = ActionType<typeof actions>;

const initialState: AuthStateType = {
  authentificated: !!tokenHandler.get(),
  user: null,
};

const reducer = createReducer<AuthStateType, Action>(initialState).handleAction(actions.googleSignIn.success, (state) =>
  produce(state, (nextState) => {
    nextState.authentificated = true;
  }),
);

export { reducer as AuthReducer };
