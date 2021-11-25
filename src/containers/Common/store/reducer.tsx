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
  userProposals: [],
  isDiscussionsLoaded: false,
  isProposalsLoaded: false,
  currentDiscussion: null,
  currentProposal: null,
};

type Action = ActionType<typeof actions>;

const reducer = createReducer<CommonsStateType, Action>(initialState)
  .handleAction(actions.getCommonsList.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.commons = action.payload;
    })
  )
  .handleAction(actions.updatePage, (state, action) =>
    produce(state, (nextState) => {
      nextState.page = action.payload;
    })
  )
  .handleAction(actions.getCommonDetail.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.common = action.payload;
    })
  )
  .handleAction(actions.setDiscussion, (state, action) =>
    produce(state, (nextState) => {
      nextState.discussions = action.payload;
    })
  )
  .handleAction(actions.setProposals, (state, action) =>
    produce(state, (nextState) => {
      nextState.proposals = action.payload;
    })
  )
  .handleAction(actions.loadCommonDiscussionList.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.discussions = action.payload;
      nextState.isDiscussionsLoaded = true;
    })
  )
  .handleAction(actions.loadProposalList.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.proposals = action.payload;
      nextState.isProposalsLoaded = true;
    })
  )
  .handleAction(actions.loadUserProposalList.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.userProposals = action.payload;
    })
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
    })
  )
  .handleAction(actions.clearCurrentDiscussion, (state, action) =>
    produce(state, (nextState) => {
      nextState.currentDiscussion = null;
    })
  )
  .handleAction(actions.clearCurrentProposal, (state, action) =>
    produce(state, (nextState) => {
      nextState.currentProposal = null;
    })
  )
  .handleAction(actions.closeCurrentCommon, (state, action) =>
    produce(state, (nextState) => {
      nextState.currentDiscussion = null;
      nextState.common = null;
      nextState.discussions = [];
      nextState.proposals = [];
      nextState.isDiscussionsLoaded = false;
      nextState.isProposalsLoaded = false;
    })
  )
  .handleAction(actions.loadProposalDetail.success, (state, action) =>
    produce(state, (nextState) => {
      const proposal = { ...action.payload };
      const { proposals } = state;
      proposal.isLoaded = true;
      const index = proposals.findIndex((d) => d.id === proposal.id);
      proposals[index] = proposal;
      nextState.proposals = proposals;
      nextState.currentProposal = proposal;
    })
  );

export default reducer;
