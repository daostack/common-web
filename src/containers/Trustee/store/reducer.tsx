import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import { TrusteeStateType } from "../interfaces";
import * as actions from "./actions";

const initialState: TrusteeStateType = {
  pendingApprovalProposals: [],
  arePendingApprovalProposalsLoaded: false,
  approvedProposals: [],
  areApprovedProposalLoaded: false,
  declinedProposals: [],
  areDeclinedProposalsLoaded: false,
};

type Action = ActionType<typeof actions>;

const reducer = createReducer<TrusteeStateType, Action>(initialState)
  .handleAction(actions.getPendingApprovalProposals.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.pendingApprovalProposals = action.payload;
      nextState.arePendingApprovalProposalsLoaded = true;
    })
  )
  .handleAction(actions.getApprovedProposals.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.approvedProposals = action.payload;
      nextState.areApprovedProposalLoaded = true;
    })
  )
  .handleAction(actions.getDeclinedProposals.success, (state, action) =>
    produce(state, (nextState) => {
      nextState.declinedProposals = action.payload;
      nextState.areDeclinedProposalsLoaded = true;
    })
  );

export default reducer;
