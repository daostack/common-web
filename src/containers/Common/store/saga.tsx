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
  subscribeToDiscussionMessages,
} from "./api";

import { selectDiscussions, selectProposals } from "./selectors";
import store from "@/index";

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

export function* getCommonDetail(
  action: ReturnType<typeof actions.getCommonDetail.request>
): Generator {
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

    yield call(
      subscribeToCommonDiscussion,
      action.payload.payload.commonId,
      async (data) => {
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
    );

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
      subscribeToDiscussionMessages,
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

function* commonsSaga() {
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
}

export default commonsSaga;
