import { call, put, takeLatest } from "redux-saga/effects";
import { Proposal } from "../../../shared/models";
import * as actions from "./actions";
import {
  fetchPendingApprovalProposals,
  fetchApprovedProposals,
  fetchDeclinedProposals,
} from "./api";

export function* getPendingApprovalProposals(): Generator {
  try {
    const proposals = (yield call(fetchPendingApprovalProposals)) as Proposal[];

    yield put(actions.getPendingApprovalProposals.success(proposals));
  } catch (error) {
    yield put(actions.getPendingApprovalProposals.failure(error));
  }
}

export function* getApprovedProposals(): Generator {
  try {
    const proposals = (yield call(fetchApprovedProposals)) as Proposal[];

    yield put(actions.getApprovedProposals.success(proposals));
  } catch (error) {
    yield put(actions.getApprovedProposals.failure(error));
  }
}

export function* getDeclinedProposals(): Generator {
  try {
    const proposals = (yield call(fetchDeclinedProposals)) as Proposal[];

    yield put(actions.getDeclinedProposals.success(proposals));
  } catch (error) {
    yield put(actions.getDeclinedProposals.failure(error));
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
