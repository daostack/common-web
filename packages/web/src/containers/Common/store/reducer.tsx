import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import { CommonsStateType } from "../interfaces";
import * as actions from "./actions";

const initialState: CommonsStateType = {
  commons: [],
  common: null,
  page: 1,
  proposals: [],
  discussions: [],
  isDiscussionsLoaded: false,
};

type Action = ActionType<typeof actions>;

const reducer = createReducer<CommonsStateType, Action>(initialState)
  .handleAction(actions.getCommonsList.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.commons = action.payload;
    }),
  )
  .handleAction(actions.updatePage, (state, action) =>
    produce(state, (nextState) => {
      nextState.page = action.payload;
    }),
  )
  .handleAction(actions.getCommonDetail.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.common = action.payload;
    }),
  )
  .handleAction(actions.setDiscussion, (state, action) =>
    produce(state, (nextState) => {
      nextState.discussions = action.payload;
    }),
  )
  .handleAction(actions.setProposals, (state, action) =>
    produce(state, (nextState) => {
      nextState.proposals = action.payload;
    }),
  )
  .handleAction(actions.loadCommonDiscussionList.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.discussions = action.payload;
      nextState.isDiscussionsLoaded = true;
    }),
  );

export default reducer;
