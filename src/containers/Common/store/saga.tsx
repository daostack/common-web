import { call, put, select, takeLatest } from "redux-saga/effects";
import { actions } from ".";
import {
  Common,
  Discussion,
  User,
  DiscussionMessage,
  Proposal,
} from "../../../shared/models";
import { startLoading, stopLoading } from "@/shared/store/actions";
import {
  createCommon as createCommonApi,
  createRequestToJoin as createRequestToJoinApi,
  fetchCommonList,
  fetchCommonDetail,
  fetchCommonDiscussions,
  fetchCommonProposals,
  fetchOwners,
  fetchDiscussionsMessages,
  fetchUserProposals,
  createDiscussion,
  subscribeToCommonDiscussion,
  addMessageToDiscussion,
  subscribeToMessages,
  createFundingProposal,
  subscribeToCommonProposal,
  checkUserPaymentMethod,
  deleteCommon as deleteCommonApi,
  createVote as createVoteApi,
  makeImmediateContribution as makeImmediateContributionApi,
  addBankDetails as addBankDetailsApi,
  getBankDetails as getBankDetailsApi,
} from "./api";

import { selectDiscussions, selectProposals } from "./selectors";
import store from "@/index";
import { AddProposalSteps } from "@/containers/Common/components/CommonDetailContainer/AddProposalComponent/AddProposalComponent";
import { Vote } from "@/shared/interfaces/api/vote";
import { ImmediateContributionResponse } from "../interfaces";

export function* getCommonsList(): Generator {
  try {
    yield put(startLoading());
    const commons = yield call(fetchCommonList);

    yield put(actions.getCommonsList.success(commons as Common[]));
    yield put(stopLoading());
  } catch (e) {
    yield put(actions.getCommonsList.failure(e));
    yield put(stopLoading());
  }
}

export function* getCommonDetail({
  payload,
}: ReturnType<typeof actions.getCommonDetail.request>): Generator {
  try {
    yield put(startLoading());
    const common = (yield call(fetchCommonDetail, payload.payload)) as Common;

    const [discussions, proposals] = (yield Promise.all([
      fetchCommonDiscussions(common.id),
      fetchCommonProposals(common.id),
    ])) as any[];

    yield put(actions.getCommonDetail.success(common));
    yield put(actions.setDiscussion(discussions));
    yield put(actions.setProposals(proposals));

    if (payload.callback) {
      payload.callback(null, common);
    }
  } catch (e) {
    yield put(actions.getCommonDetail.failure(e));

    if (payload.callback) {
      payload.callback(e);
    }
  } finally {
    yield put(stopLoading());
  }
}

export function* loadCommonDiscussionList(): Generator {
  try {
    yield put(startLoading());
    const discussions: Discussion[] = (yield select(
      selectDiscussions()
    )) as Discussion[];

    const ownerIds = Array.from(new Set(discussions.map((d) => d.ownerId)));
    const discussions_ids = discussions.map((d) => d.id);

    const owners = (yield fetchOwners(ownerIds)) as User[];
    const dMessages = (yield fetchDiscussionsMessages(
      discussions_ids
    )) as DiscussionMessage[];

    const loadedDiscussions = discussions.map((d) => {
      d.discussionMessage = dMessages.filter((dM) => dM.discussionId === d.id);
      d.owner = owners.find((o) => o.uid === d.ownerId);
      return d;
    });

    yield put(actions.loadCommonDiscussionList.success(loadedDiscussions));
    yield put(stopLoading());
  } catch (e) {
    yield put(actions.loadCommonDiscussionList.failure(e));
    yield put(stopLoading());
  }
}

export function* loadDiscussionDetail(
  action: ReturnType<typeof actions.loadDisscussionDetail.request>
): Generator {
  try {
    yield put(startLoading());
    const discussion = { ...action.payload };

    const { discussionMessage } = action.payload;

    const ownerIds = Array.from(
      new Set(discussionMessage?.map((d) => d.ownerId))
    );
    const owners = (yield fetchOwners(ownerIds)) as User[];

    const loadedDisscussionMessage = discussionMessage?.map((d) => {
      d.owner = owners.find((o) => o.uid === d.ownerId);
      return d;
    });
    discussion.discussionMessage = loadedDisscussionMessage;

    yield put(actions.loadDisscussionDetail.success(discussion));
    yield put(stopLoading());
  } catch (e) {
    yield put(actions.loadDisscussionDetail.failure(e));
    yield put(stopLoading());
  }
}

export function* loadProposalList(
  action: ReturnType<typeof actions.loadProposalList.request>
): Generator {
  try {
    yield put(startLoading());

    const proposals: Proposal[] = (yield select(
      selectProposals()
    )) as Proposal[];

    const ownerIds = Array.from(new Set(proposals.map((d) => d.proposerId)));
    const discussions_ids = proposals.map((d) => d.id);

    const owners = (yield fetchOwners(ownerIds)) as User[];
    const dMessages = (yield fetchDiscussionsMessages(
      discussions_ids
    )) as DiscussionMessage[];

    const loadedProposals = proposals.map((d) => {
      d.discussionMessage = dMessages.filter((dM) => dM.discussionId === d.id);
      d.proposer = owners.find((o) => o.uid === d.proposerId);
      return d;
    });

    yield put(actions.loadProposalList.success(loadedProposals));
    yield put(stopLoading());
  } catch (e) {
    yield put(actions.loadProposalList.failure(e));
    yield put(stopLoading());
  }
}

export function* loadProposalDetail(
  action: ReturnType<typeof actions.loadProposalDetail.request>
): Generator {
  try {
    yield put(startLoading());
    const proposal = { ...action.payload };

    const { discussionMessage } = action.payload;

    const ownerIds = Array.from(
      new Set(discussionMessage?.map((d) => d.ownerId))
    );
    const owners = (yield fetchOwners(ownerIds)) as User[];
    const loadedDisscussionMessage = discussionMessage?.map((d) => {
      d.owner = owners.find((o) => o.uid === d.ownerId);
      return d;
    });
    proposal.discussionMessage = loadedDisscussionMessage;

    yield put(actions.loadProposalDetail.success(proposal));
    yield put(stopLoading());
  } catch (e) {
    yield put(actions.loadProposalDetail.failure(e));
    yield put(stopLoading());
  }
}

export function* loadUserProposalList(
  action: ReturnType<typeof actions.loadUserProposalList.request>
): Generator {
  try {
    yield put(startLoading());
    const proposals = yield fetchUserProposals(action.payload);

    yield put(actions.loadUserProposalList.success(proposals as Proposal[]));
    yield put(stopLoading());
  } catch (e) {
    yield put(actions.loadUserProposalList.failure(e));
    yield put(stopLoading());
  }
}

export function* createDiscussionSaga(
  action: ReturnType<typeof actions.createDiscussion.request>
): Generator {
  try {
    yield put(startLoading());

    yield createDiscussion(action.payload.payload);

    const unsubscribe = (yield call(
      subscribeToCommonDiscussion,
      action.payload.payload.commonId,
      async (data) => {
        unsubscribe();

        const d = data.find(
          (d: Discussion) => d.title === action.payload.payload.title
        );

        if (d) {
          d.owner = store.getState().auth.user;
          action.payload.callback(d);
        }

        const ds = await fetchCommonDiscussions(
          action.payload.payload.commonId
        );

        store.dispatch(actions.setDiscussion(ds));
        store.dispatch(actions.loadCommonDiscussionList.request());
      }
    )) as () => void;

    yield put(stopLoading());
  } catch (e) {
    yield put(actions.createDiscussion.failure(e));
    yield put(stopLoading());
  }
}

export function* addMessageToDiscussionSaga(
  action: ReturnType<typeof actions.addMessageToDiscussion.request>
): Generator {
  try {
    yield put(startLoading());

    yield addMessageToDiscussion(action.payload.payload);

    yield call(
      subscribeToMessages,
      action.payload.payload.discussionId,
      async (data) => {
        const { discussion } = action.payload;

        discussion.discussionMessage = data.sort(
          (m: DiscussionMessage, mP: DiscussionMessage) =>
            m.createTime?.seconds - mP.createTime?.seconds
        );
        store.dispatch(actions.loadDisscussionDetail.request(discussion));
      }
    );

    yield put(stopLoading());
  } catch (e) {
    yield put(actions.addMessageToDiscussion.failure(e));
    yield put(stopLoading());
  }
}

export function* addMessageToProposalSaga(
  action: ReturnType<typeof actions.addMessageToProposal.request>
): Generator {
  try {
    yield put(startLoading());

    yield addMessageToDiscussion(action.payload.payload);

    yield call(
      subscribeToMessages,
      action.payload.payload.discussionId,
      async (data) => {
        const { proposal } = action.payload;

        proposal.discussionMessage = data.sort(
          (m: DiscussionMessage, mP: DiscussionMessage) =>
            m.createTime?.seconds - mP.createTime?.seconds
        );

        store.dispatch(actions.loadProposalDetail.request(proposal));
      }
    );

    yield put(stopLoading());
  } catch (e) {
    yield put(actions.addMessageToProposal.failure(e));
    yield put(stopLoading());
  }
}

export function* createRequestToJoin(
  action: ReturnType<typeof actions.createRequestToJoin.request>
): Generator {
  try {
    yield put(startLoading());
    const proposal = (yield createRequestToJoinApi(action.payload)) as Proposal;

    yield put(actions.createRequestToJoin.success(proposal));
    yield put(stopLoading());
  } catch (error) {
    yield put(actions.createRequestToJoin.failure(error));
    yield put(stopLoading());
  }
}

export function* deleteCommon(
  action: ReturnType<typeof actions.deleteCommon.request>
): Generator {
  try {
    yield put(startLoading());
    yield deleteCommonApi(action.payload.payload);

    yield put(actions.deleteCommon.success());
    action.payload.callback(null);
    yield put(stopLoading());
  } catch (error) {
    yield put(actions.deleteCommon.failure(error));
    action.payload.callback(error);
    yield put(stopLoading());
  }
}

export function* vote(
  action: ReturnType<typeof actions.createVote.request>
): Generator {
  try {
    yield put(startLoading());
    const vote = (yield createVoteApi(action.payload.payload)) as Vote;

    yield call(async () => {
      const proposals = await fetchCommonProposals(vote.commonId);
      store.dispatch(actions.setProposals(proposals));
      store.dispatch(actions.loadProposalList.request());
      store.dispatch(stopLoading());
    });
    yield put(actions.createVote.success());
    action.payload.callback(null);
    yield put(stopLoading());
  } catch (error) {
    yield put(actions.createVote.failure(error));
    action.payload.callback(error);
    yield put(stopLoading());
  }
}

export function* getBankDetails(
  action: ReturnType<typeof actions.getBankDetails.request>
): Generator {
  try {
    yield put(startLoading());
    yield getBankDetailsApi();

    yield put(actions.getBankDetails.success());
    action.payload.callback(null);
    yield put(stopLoading());
  } catch (error) {
    yield put(actions.getBankDetails.failure(error));
    action.payload.callback(error);
    yield put(stopLoading());
  }
}

export function* addBankDetails(
  action: ReturnType<typeof actions.addBankDetails.request>
): Generator {
  try {
    yield put(startLoading());
    yield addBankDetailsApi(action.payload.payload);

    yield put(actions.addBankDetails.success());
    action.payload.callback(null);
    yield put(stopLoading());
  } catch (error) {
    yield put(actions.addBankDetails.failure(error));
    action.payload.callback(error);
    yield put(stopLoading());
  }
}

export function* createFundingProposalSaga(
  action: ReturnType<typeof actions.createFundingProposal.request>
): Generator {
  try {
    yield put(startLoading());
    const proposal = (yield createFundingProposal(
      action.payload.payload
    )) as Proposal;

    yield call(
      subscribeToCommonProposal,
      action.payload.payload.commonId,
      async (data) => {
        const ds = await fetchCommonProposals(action.payload.payload.commonId);

        store.dispatch(actions.setProposals(ds));
        store.dispatch(actions.loadProposalList.request());
        store.dispatch(stopLoading());
        action.payload.callback(AddProposalSteps.SUCCESS);
      }
    );

    yield put(actions.createFundingProposal.success(proposal));
    yield put(stopLoading());
  } catch (error) {
    action.payload.callback(AddProposalSteps.FAILURE);
    yield put(actions.createFundingProposal.failure(error));
    yield put(stopLoading());
  }
}

export function* checkUserPaymentMethodSaga(
  action: ReturnType<typeof actions.checkUserPaymentMethod.request>
): Generator {
  try {
    const { user } = store.getState().auth;
    if (user && user.uid) {
      yield put(startLoading());

      const hasPaymentMethod = yield checkUserPaymentMethod(user.uid);

      yield put(actions.checkUserPaymentMethod.success(!!hasPaymentMethod));

      yield put(stopLoading());
    }
  } catch (e) {
    yield put(actions.checkUserPaymentMethod.failure(e));
    yield put(stopLoading());
  }
}

export function* createCommon(
  action: ReturnType<typeof actions.createCommon.request>
): Generator {
  try {
    const common = (yield call(
      createCommonApi,
      action.payload.payload
    )) as Common;

    yield put(actions.createCommon.success(common));
    action.payload.callback(null, common);
  } catch (error) {
    yield put(actions.createCommon.failure(error));
    action.payload.callback(error);
  }
}

export function* makeImmediateContribution(
  action: ReturnType<typeof actions.makeImmediateContribution.request>
): Generator {
  try {
    const response = (yield call(
      makeImmediateContributionApi,
      action.payload.payload
    )) as ImmediateContributionResponse;

    yield put(actions.makeImmediateContribution.success(response));
    action.payload.callback(null, response);
  } catch (error) {
    yield put(actions.makeImmediateContribution.failure(error));
    action.payload.callback(error);
  }
}

export function* commonsSaga() {
  yield takeLatest(actions.getCommonsList.request, getCommonsList);
  yield takeLatest(actions.getCommonDetail.request, getCommonDetail);
  yield takeLatest(
    actions.loadCommonDiscussionList.request,
    loadCommonDiscussionList
  );
  yield takeLatest(actions.loadDisscussionDetail.request, loadDiscussionDetail);
  yield takeLatest(actions.loadProposalList.request, loadProposalList);
  yield takeLatest(actions.loadProposalDetail.request, loadProposalDetail);
  yield takeLatest(actions.loadUserProposalList.request, loadUserProposalList);
  yield takeLatest(actions.createDiscussion.request, createDiscussionSaga);
  yield takeLatest(
    actions.addMessageToDiscussion.request,
    addMessageToDiscussionSaga
  );
  yield takeLatest(actions.createRequestToJoin.request, createRequestToJoin);
  yield takeLatest(actions.deleteCommon.request, deleteCommon);
  yield takeLatest(
    actions.createFundingProposal.request,
    createFundingProposalSaga
  );
  yield takeLatest(
    actions.checkUserPaymentMethod.request,
    checkUserPaymentMethodSaga
  );
  yield takeLatest(
    actions.addMessageToProposal.request,
    addMessageToProposalSaga
  );
  yield takeLatest(actions.createCommon.request, createCommon);
  yield takeLatest(actions.createVote.request, vote);
  yield takeLatest(
    actions.makeImmediateContribution.request,
    makeImmediateContribution
  );
  yield takeLatest(actions.getBankDetails.request, getBankDetails);
  yield takeLatest(actions.addBankDetails.request, addBankDetails);
}

export default commonsSaga;
