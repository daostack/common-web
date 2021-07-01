import { call, put, select, takeLatest } from "redux-saga/effects";
import { actions } from ".";
import { Common, Discussion, User, DiscussionMessage, Proposal } from "../../../shared/models";
import { startLoading, stopLoading } from "../../../shared/store/actions";
import {
  fetchCommonList,
  fetchCommonDetail,
  fetchCommonDiscussions,
  fetchCommonProposals,
  fetchOwners,
  fetchDiscussionsMessages,
} from "./api";

import { selectDiscussions, selectProposals } from "./selectors";

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

export function* getCommonDetail(action: ReturnType<typeof actions.getCommonDetail.request>): Generator {
  try {
    yield put(startLoading());
    const common = yield call(fetchCommonDetail, action.payload);

    const [discussions, proposals] = (yield Promise.all([
      fetchCommonDiscussions((common as Common).id),
      fetchCommonProposals((common as Common).id),
    ])) as any[];

    yield put(actions.getCommonDetail.success(common as Common));
    yield put(actions.setDiscussion(discussions));
    yield put(actions.setProposals(proposals));

    yield put(stopLoading());
  } catch (e) {
    yield put(actions.getCommonDetail.failure(e));
    yield put(stopLoading());
  }
}

export function* loadCommonDiscussionList(
  action: ReturnType<typeof actions.loadCommonDiscussionList.request>,
): Generator {
  try {
    yield put(startLoading());
    const discussions: Discussion[] = (yield select(selectDiscussions())) as Discussion[];

    const ownerIds = Array.from(new Set(discussions.map((d) => d.ownerId)));
    const discussions_ids = discussions.map((d) => d.id);

    const owners = (yield fetchOwners(ownerIds)) as User[];
    const dMessages = (yield fetchDiscussionsMessages(discussions_ids)) as DiscussionMessage[];

    const loadedDiscussions = discussions.map((d) => {
      //  d.discussionMessage = dMessages.filter((dM) => dM.discussionId === d.id);
      d.owner = owners.find((o) => o.id === d.ownerId);
      return d;
    });

    yield put(actions.loadCommonDiscussionList.success(loadedDiscussions));
    yield put(stopLoading());
  } catch (e) {
    yield put(actions.loadCommonDiscussionList.failure(e));
    yield put(stopLoading());
  }
}

export function* loadDiscussionDetail(action: ReturnType<typeof actions.loadDisscussionDetail.request>): Generator {
  try {
    yield put(startLoading());
    const discussion = { ...action.payload };
    // if (!discussion.isLoaded) {
    //   const { discussionMessage } = action.payload;

    //   const ownerIds = Array.from(new Set(discussionMessage?.map((d) => d.ownerId)));
    //   const owners = (yield fetchOwners(ownerIds)) as User[];
    //   const loadedDisscussionMessage = discussionMessage?.map((d) => {
    //     d.owner = owners.find((o) => o.uid === d.ownerId);
    //     return d;
    //   });
    //   discussion.discussionMessage = loadedDisscussionMessage;
    // }

    yield put(actions.loadDisscussionDetail.success(discussion));
    yield put(stopLoading());
  } catch (e) {
    yield put(actions.loadDisscussionDetail.failure(e));
    yield put(stopLoading());
  }
}

export function* loadProposalList(action: ReturnType<typeof actions.loadProposalList.request>): Generator {
  try {
    yield put(startLoading());

    const proposals: Proposal[] = (yield select(selectProposals())) as Proposal[];

    const ownerIds = Array.from(new Set(proposals.map((d) => d.proposerId)));
    const discussions_ids = proposals.map((d) => d.id);

    const owners = (yield fetchOwners(ownerIds)) as User[];
    const dMessages = (yield fetchDiscussionsMessages(discussions_ids)) as DiscussionMessage[];

    const loadedProposals = proposals.map((d) => {
      d.discussionMessage = dMessages.filter((dM) => dM.id === d.id);
      d.proposer = owners.find((o) => o.id === d.proposerId);
      return d;
    });

    yield put(actions.loadProposalList.success(loadedProposals));
    yield put(stopLoading());
  } catch (e) {
    yield put(actions.loadProposalList.failure(e));
    yield put(stopLoading());
  }
}

export function* loadProposalDetail(action: ReturnType<typeof actions.loadProposalDetail.request>): Generator {
  try {
    yield put(startLoading());
    const proposal = { ...action.payload };
    // if (!proposal.isLoaded) {
    //   const { discussionMessage } = action.payload;

    //   const ownerIds = Array.from(new Set(discussionMessage?.map((d) => d.owner?.id)));
    //   const owners = (yield fetchOwners(ownerIds)) as User[];
    //   const loadedDisscussionMessage = discussionMessage?.map((d) => {
    //     d.owner = owners.find((o) => o.id === d.owner?.id);
    //     return d;
    //   });
    //   proposal.discussionMessage = loadedDisscussionMessage;
    // }

    yield put(actions.loadProposalDetail.success(proposal));
    yield put(stopLoading());
  } catch (e) {
    yield put(actions.loadProposalDetail.failure(e));
    yield put(stopLoading());
  }
}

function* commonsSaga() {
  yield takeLatest(actions.getCommonsList.request, getCommonsList);
  yield takeLatest(actions.getCommonDetail.request, getCommonDetail);
  yield takeLatest(actions.loadCommonDiscussionList.request, loadCommonDiscussionList);
  yield takeLatest(actions.loadDisscussionDetail.request, loadDiscussionDetail);
  yield takeLatest(actions.loadProposalList.request, loadProposalList);
  yield takeLatest(actions.loadProposalDetail.request, loadProposalDetail);
}

export default commonsSaga;
