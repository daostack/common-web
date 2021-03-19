import { call, put, takeLatest } from "redux-saga/effects";
import { actions } from ".";
import { Common, Discussion, Proposal } from "../../../shared/models";
import { transformFirebaseDataList, transformFirebaseDataSingle } from "../../../shared/utils";
import firebase from "../../../shared/utils/firebase";

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

function* commonsSaga() {
  yield takeLatest(actions.getCommonsList.request, getCommonsList);
  yield takeLatest(actions.getCommonDetail.request, getCommonDetail);
}

export default commonsSaga;
