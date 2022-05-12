import { call, put, select, takeLatest } from "redux-saga/effects";
import { fetchCommonListByIds } from "@/containers/Common/store/api";
import { Common, Proposal } from "@/shared/models";
import { TrusteeStateType } from "../interfaces";
import * as actions from "./actions";
import {
  fetchPendingApprovalProposals,
  fetchApprovedProposals,
  fetchDeclinedProposals,
  fetchProposalById,
  approveOrDeclineProposal as approveOrDeclineProposalApi,
} from "./api";
import { selectCommons } from "./selectors";

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

export function* getProposalsData({
  payload,
}: ReturnType<typeof actions.getProposalsData.request>): Generator {
  const { ids: currentCommonIds } = (yield select(
    selectCommons()
  )) as TrusteeStateType["commons"];
  const nextCommonIds = payload.commonIds.filter(
    (id) => !currentCommonIds.includes(id)
  );

  yield put(
    actions.updateProposalsData({
      commonIds: nextCommonIds,
    })
  );

  try {
    const { commons } = (yield call(async () => {
      const [commons] = await Promise.all([
        fetchCommonListByIds(nextCommonIds),
      ]);

      return { commons };
    })) as { commons: Common[] };

    yield put(actions.getProposalsData.success({ commons }));
  } catch (error) {
    yield put(actions.getProposalsData.failure(error));
  }
}

export function* getProposalForApproval(
  action: ReturnType<typeof actions.getProposalForApproval.request>
): Generator {
  try {
    const proposal = (yield call(
      fetchProposalById,
      action.payload
    )) as Proposal | null;

    if (!proposal) {
      throw new Error(`There is no proposal with id="${action.payload}"`);
    }

    yield put(actions.getProposalForApproval.success(proposal));
  } catch (error) {
    yield put(actions.getProposalForApproval.failure(error));
  }
}

export function* approveOrDeclineProposal(
  action: ReturnType<typeof actions.approveOrDeclineProposal.request>
): Generator {
  try {
    yield call(approveOrDeclineProposalApi, action.payload.payload);
    yield put(actions.approveOrDeclineProposal.success());
    action.payload.callback(null);
  } catch (error) {
    yield put(actions.approveOrDeclineProposal.failure(error));
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
  yield takeLatest(actions.getProposalsData.request, getProposalsData);
  yield takeLatest(
    actions.getProposalForApproval.request,
    getProposalForApproval
  );
  yield takeLatest(
    actions.approveOrDeclineProposal.request,
    approveOrDeclineProposal
  );
}

export default trusteeSaga;
