import { call, put, takeLatest } from "redux-saga/effects";
import { Proposal } from "../../../shared/models";
import * as actions from "./actions";
import {
  fetchPendingApprovalProposals,
  fetchApprovedProposals,
  fetchDeclinedProposals,
} from "./api";

export function* getPendingApprovalProposals(
  action: ReturnType<typeof actions.getPendingApprovalProposals.request>
): Generator {
  try {
    const proposals = (yield call(fetchPendingApprovalProposals)) as Proposal[];

    yield put(actions.getPendingApprovalProposals.success(proposals));
    action.payload.callback(null, proposals);
  } catch (error) {
    yield put(actions.getPendingApprovalProposals.failure(error));
    action.payload.callback(error);
  }
}

export function* getApprovedProposals(
  action: ReturnType<typeof actions.getApprovedProposals.request>
): Generator {
  try {
    const proposals = (yield call(fetchApprovedProposals)) as Proposal[];

    yield put(actions.getApprovedProposals.success(proposals));
    action.payload.callback(null, proposals);
  } catch (error) {
    yield put(actions.getApprovedProposals.failure(error));
    action.payload.callback(error);
  }
}

export function* getDeclinedProposals(
  action: ReturnType<typeof actions.getDeclinedProposals.request>
): Generator {
  try {
    const proposals = (yield call(fetchDeclinedProposals)) as Proposal[];

    yield put(actions.getDeclinedProposals.success(proposals));
    action.payload.callback(null, proposals);
  } catch (error) {
    yield put(actions.getDeclinedProposals.failure(error));
    action.payload.callback(error);
  }
}

function* trusteeSaga(): Generator {
  yield takeLatest(
    actions.getPendingApprovalProposals.request,
    getPendingApprovalProposals
  );
  yield takeLatest(actions.getApprovedProposals.request, getApprovedProposals);
  yield takeLatest(actions.getDeclinedProposals.request, getDeclinedProposals);
}

export default trusteeSaga;
