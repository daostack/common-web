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
  isProposalsLoaded: false,
  currentDiscussion: null,
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
  )
  .handleAction(actions.loadProposalList.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.proposals = action.payload;
      nextState.isProposalsLoaded = true;
    }),
  )
  .handleAction(actions.loadDisscussionDetail.success, (state, action) =>
    produce(state, (nextState) => {
      const disscussion = { ...action.payload };
      const { discussions } = state;
      disscussion.isLoaded = true;
      const index = discussions.findIndex((d) => d.id === disscussion.id);
      discussions[index] = disscussion;
      nextState.discussions = discussions;
      nextState.currentDiscussion = disscussion;
    }),
  )
  .handleAction(actions.clearCurrentDiscussion, (state, action) =>
    produce(state, (nextState) => {
      nextState.currentDiscussion = null;
    }),
  )
  .handleAction(actions.closeCurrentCommon, (state, action) =>
    produce(state, (nextState) => {
      nextState.currentDiscussion = null;
      nextState.common = null;
      nextState.discussions = [];
      nextState.proposals = [];
      nextState.isDiscussionsLoaded = false;
      nextState.isProposalsLoaded = false;
    }),
  );

export default reducer;
