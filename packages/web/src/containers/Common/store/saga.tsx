import { call, put, select, takeLatest } from "redux-saga/effects";
import { actions } from ".";
import { Common, Discussion, Proposal, User, DiscussionMessage } from "../../../shared/models";
import { transformFirebaseDataList, transformFirebaseDataSingle } from "../../../shared/utils";
import firebase from "../../../shared/utils/firebase";
import { selectDiscussions } from "./selectors";

async function fetchCommonDiscussions(commonId: string) {
  const commons = await firebase.firestore().collection("discussion").where("commonId", "==", commonId).get();
  const data = transformFirebaseDataList<Discussion>(commons);

  return data.sort(
    (proposal: Discussion, prevProposal: Discussion) => prevProposal.createTime?.seconds - proposal.createTime?.seconds,
  );
}

async function fetchCommonProposals(commonId: string) {
  const commons = await firebase.firestore().collection("proposals").where("commonId", "==", commonId).get();
  const data = transformFirebaseDataList<Proposal>(commons);

  return data.sort(
    (proposal: Proposal, prevProposal: Proposal) => prevProposal.createdAt?.seconds - proposal.createdAt?.seconds,
  );
}

async function fetchCommonList(): Promise<Common[]> {
  const commons = await firebase.firestore().collection("daos").get();
  const data = transformFirebaseDataList<Common>(commons);
  return data;
}

async function fetchCommonDetail(id: string): Promise<Common> {
  const common = await firebase.firestore().collection("daos").doc(id).get();
  const data = transformFirebaseDataSingle<Common>(common);
  return data;
}

async function fetchDiscussionsOwners(ownerids: string[]) {
  const users = await firebase.firestore().collection("users").where("uid", "in", ownerids).get();
  const data = transformFirebaseDataList<User>(users);
  return data;
}

async function fetchDiscussionsMessages(dIds: string[]) {
  const idsChunks = dIds.reduce((resultArray: any, item, index) => {
    const chunkIndex = Math.floor(index / 10);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  const discussions = await Promise.all(
    idsChunks.map((ids: string[]) =>
      firebase.firestore().collection("discussionMessage").where("discussionId", "in", ids).get(),
    ),
  );
  const data = (discussions as unknown[])
    .map((d: any) => transformFirebaseDataList<DiscussionMessage>(d))
    .reduce((resultArray: any, item) => {
      resultArray.push(...item);
      return resultArray;
    }, []);

  return data;
}

export function* getCommonsList(): Generator {
  try {
    const commons = yield call(fetchCommonList);

    yield put(actions.getCommonsList.success(commons as Common[]));
  } catch (e) {
    yield put(actions.getCommonsList.failure(e));
  }
}

export function* getCommonDetail(action: ReturnType<typeof actions.getCommonDetail.request>): Generator {
  try {
    const common = yield call(fetchCommonDetail, action.payload);

    const [discussions, proposals] = (yield Promise.all([
      fetchCommonDiscussions((common as Common).id),
      fetchCommonProposals((common as Common).id),
    ])) as any[];

    yield put(actions.getCommonDetail.success(common as Common));
    yield put(actions.setDiscussion(discussions));
    yield put(actions.setProposals(proposals));
  } catch (e) {
    yield put(actions.getCommonDetail.failure(e));
  }
}

export function* loadCommonDiscussionList(
  action: ReturnType<typeof actions.loadCommonDiscussionList.request>,
): Generator {
  try {
    const discussions: Discussion[] = (yield select(selectDiscussions())) as Discussion[];

    const ownerIds = Array.from(new Set(discussions.map((d) => d.ownerId)));
    const discussions_ids = discussions.map((d) => d.id);

    const owners = (yield fetchDiscussionsOwners(ownerIds)) as User[];
    const dMessages = (yield fetchDiscussionsMessages(discussions_ids)) as DiscussionMessage[];

    const loadedDiscussions = discussions.map((d) => {
      d.discussionMessage = dMessages.filter((dM) => dM.discussionId === d.id);
      d.owner = owners.find((o) => o.uid === d.ownerId);
      return d;
    });

    yield put(actions.loadCommonDiscussionList.success(loadedDiscussions));
  } catch (e) {
    yield put(actions.loadCommonDiscussionList.failure(e));
  }
}

function* commonsSaga() {
  yield takeLatest(actions.getCommonsList.request, getCommonsList);
  yield takeLatest(actions.getCommonDetail.request, getCommonDetail);
  yield takeLatest(actions.loadCommonDiscussionList.request, loadCommonDiscussionList);
}

export default commonsSaga;
