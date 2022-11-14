import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import { LoadingState } from "@/shared/interfaces";
import { FundsAllocation } from "@/shared/models/governance/proposals";
import { TrusteeStateType } from "../interfaces";
import * as actions from "./actions";

const INITIAL_PROPOSALS_STATE: LoadingState<FundsAllocation[]> = {
  data: [],
  loading: false,
  fetched: false,
};

const initialState: TrusteeStateType = {
  pendingApprovalProposals: { ...INITIAL_PROPOSALS_STATE },
  approvedProposals: { ...INITIAL_PROPOSALS_STATE },
  declinedProposals: { ...INITIAL_PROPOSALS_STATE },
  commons: {
    ids: [],
    data: null,
  },
  users: {
    ids: [],
    data: null,
  },
  proposalForApproval: null,
  isProposalForApprovalLoaded: false,
};

type Action = ActionType<typeof actions>;

const reducer = createReducer<TrusteeStateType, Action>(initialState)
  .handleAction(actions.getPendingApprovalProposals.request, (state) =>
    produce(state, (nextState) => {
      nextState.pendingApprovalProposals = {
        ...nextState.pendingApprovalProposals,
        loading: true,
      };
    }),
  )
  .handleAction(actions.getPendingApprovalProposals.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.pendingApprovalProposals = {
        data: action.payload,
        loading: false,
        fetched: true,
      };
    }),
  )
  .handleAction(actions.getPendingApprovalProposals.failure, (state) =>
    produce(state, (nextState) => {
      nextState.pendingApprovalProposals = {
        ...nextState.pendingApprovalProposals,
        loading: false,
        fetched: false,
      };
    }),
  )
  .handleAction(actions.getApprovedProposals.request, (state) =>
    produce(state, (nextState) => {
      nextState.approvedProposals = {
        ...nextState.approvedProposals,
        loading: true,
      };
    }),
  )
  .handleAction(actions.getApprovedProposals.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.approvedProposals = {
        data: action.payload,
        loading: false,
        fetched: true,
      };
    }),
  )
  .handleAction(actions.getApprovedProposals.failure, (state) =>
    produce(state, (nextState) => {
      nextState.approvedProposals = {
        ...nextState.approvedProposals,
        loading: false,
        fetched: false,
      };
    }),
  )
  .handleAction(actions.getDeclinedProposals.request, (state) =>
    produce(state, (nextState) => {
      nextState.declinedProposals = {
        ...nextState.declinedProposals,
        loading: true,
      };
    }),
  )
  .handleAction(actions.getDeclinedProposals.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.declinedProposals = {
        data: action.payload,
        loading: false,
        fetched: true,
      };
    }),
  )
  .handleAction(actions.getDeclinedProposals.failure, (state) =>
    produce(state, (nextState) => {
      nextState.declinedProposals = {
        ...nextState.declinedProposals,
        loading: false,
        fetched: false,
      };
    }),
  )
  .handleAction(actions.getProposalsData.success, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.commons = {
        ...nextState.commons,
        data: (nextState.commons.data || []).concat(payload.commons),
      };
      nextState.users = {
        ...nextState.users,
        data: (nextState.users.data || []).concat(payload.users),
      };
    }),
  )
  .handleAction(actions.getProposalsData.failure, (state) =>
    produce(state, (nextState) => {
      nextState.commons = {
        ids: [],
        data: [],
      };
      nextState.users = {
        ids: [],
        data: [],
      };
    }),
  )
  .handleAction(actions.updateProposalsData, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.commons = {
        ...nextState.commons,
        ids: nextState.commons.ids.concat(payload.commonIds),
      };
      nextState.users = {
        ...nextState.users,
        ids: nextState.users.ids.concat(payload.userIds),
      };
    }),
  )
  .handleAction(actions.clearProposals, (state) =>
    produce(state, (nextState) => {
      nextState.pendingApprovalProposals = { ...INITIAL_PROPOSALS_STATE };
      nextState.approvedProposals = { ...INITIAL_PROPOSALS_STATE };
      nextState.declinedProposals = { ...INITIAL_PROPOSALS_STATE };
    }),
  )
  .handleAction(actions.getProposalForApproval.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.proposalForApproval = action.payload;
      nextState.isProposalForApprovalLoaded = true;
    }),
  )
  .handleAction(actions.getProposalForApproval.failure, (state) =>
    produce(state, (nextState) => {
      nextState.proposalForApproval = null;
      nextState.isProposalForApprovalLoaded = true;
    }),
  )
  .handleAction(actions.clearProposalForApproval, (state) =>
    produce(state, (nextState) => {
      nextState.proposalForApproval = null;
      nextState.isProposalForApprovalLoaded = false;
    }),
  );

export default reducer;
