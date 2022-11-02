import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import { CommonState } from "@/shared/models";
import { CommonsStateType } from "../interfaces";
import * as actions from "./actions";

const initialState: CommonsStateType = {
  commons: [],
  common: null,
  governance: null,
  page: 1,
  proposals: [],
  discussions: [],
  userProposals: [],
  isCommonsLoaded: false,
  isProposalsLoaded: false,
  isUserProposalsLoaded: false,
  isDiscussionsLoaded: false,
  currentDiscussion: null,
  currentProposal: null,
  currentDiscussionMessageReply: null,
  cards: [],
  activeTab: null,
  commonStates: {},
};

type Action = ActionType<typeof actions>;

const reducer = createReducer<CommonsStateType, Action>(initialState)
  .handleAction(actions.getCommonsList.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.commons = action.payload;
      nextState.isCommonsLoaded = true;
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
  .handleAction(actions.loadUserProposalList.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.userProposals = action.payload;
      nextState.isUserProposalsLoaded = true;
    }),
  )
  .handleAction(actions.loadDiscussionDetail.success, (state, action) =>
    produce(state, (nextState) => {
      const disscussion = { ...action.payload };
      const { discussions } = nextState;
      const index = discussions.findIndex((d) => d.id === disscussion.id);
      discussions[index] = disscussion;
      nextState.discussions = discussions;
      nextState.currentDiscussion = disscussion;
    }),
  )
  .handleAction(actions.loadProposalDetail.success, (state, action) =>
    produce(state, (nextState) => {
      const proposal = { ...action.payload };
      const proposals = [...state.proposals];

      if (proposals.length) {
        const index = proposals.findIndex((d) => d.id === proposal.id);

        proposals[index] = proposal;
        nextState.proposals = [...proposals];
      }

      nextState.currentProposal = proposal;
    }),
  )
  .handleAction(actions.clearCurrentDiscussion, (state) =>
    produce(state, (nextState) => {
      nextState.currentDiscussion = null;
    }),
  )
  .handleAction(actions.updateCurrentProposal, (state, action) =>
    produce(state, (nextState) => {
      if (nextState.currentProposal) {
        nextState.currentProposal = {
          ...nextState.currentProposal,
          ...action.payload,
        };
      }
    }),
  )
  .handleAction(actions.clearCurrentProposal, (state) =>
    produce(state, (nextState) => {
      nextState.currentProposal = null;
    }),
  )
  .handleAction(actions.closeCurrentCommon, (state) =>
    produce(state, (nextState) => {
      nextState.currentDiscussion = null;
      nextState.common = null;
      nextState.governance = null;
      nextState.discussions = [];
      nextState.proposals = [];
      nextState.isDiscussionsLoaded = false;
      nextState.isProposalsLoaded = false;
      nextState.isUserProposalsLoaded = false;
    }),
  )
  .handleAction(actions.loadUserCards.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.cards = action.payload;
    }),
  )
  .handleAction(actions.createCommon.success, (state, action) =>
    produce(state, (nextState) => {
      if (action.payload.state === CommonState.ACTIVE) {
        nextState.commons = [action.payload, ...nextState.commons];
      }
    }),
  )
  .handleAction(actions.deleteCommon.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.commons = nextState.commons.filter(
        (common) => common.id !== action.payload,
      );
    }),
  )
  .handleAction(actions.setCommonActiveTab, (state, action) =>
    produce(state, (nextState) => {
      nextState.activeTab = action.payload;
    }),
  )
  .handleAction(actions.clearCommonActiveTab, (state) =>
    produce(state, (nextState) => {
      nextState.activeTab = null;
    }),
  )
  .handleAction(actions.getGovernance.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.governance = action.payload;
    }),
  )
  .handleAction(actions.getGovernance.failure, (state) =>
    produce(state, (nextState) => {
      nextState.governance = null;
    }),
  )
  .handleAction(
    actions.createMemberAdmittanceProposal.success,
    (state, action) =>
      produce(state, (nextState) => {
        nextState.proposals = [action.payload, ...nextState.proposals];
      }),
  )
  .handleAction(actions.updateCommon.success, (state, { payload }) =>
    produce(state, (nextState) => {
      if (nextState.common?.id === payload.id) {
        nextState.common = {
          ...nextState.common,
          ...payload,
        };
      }
    }),
  )
  .handleAction(
    actions.setCurrentDiscussionMessageReply,
    (state, { payload }) =>
      produce(state, (nextState) => {
        nextState.currentDiscussionMessageReply = payload;
      }),
  )
  .handleAction(actions.clearCurrentDiscussionMessageReply, (state) =>
    produce(state, (nextState) => {
      nextState.currentDiscussionMessageReply = null;
    }),
  )
  .handleAction(actions.updateCommonState, (state, { payload }) =>
    produce(state, (nextState) => {
      const { commonId, state } = payload;

      nextState.commonStates[commonId] = { ...state };
    }),
  );

export default reducer;
