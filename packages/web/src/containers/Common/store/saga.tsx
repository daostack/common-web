import { call, put, takeLatest } from "redux-saga/effects";
import { actions } from ".";
import { Common } from "../../../shared/models";
import { transformFirebaseDataList, transformFirebaseDataSingle } from "../../../shared/utils";
import firebase from "../../../shared/utils/firebase";

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
    yield put(actions.getCommonDetail.success(common as Common));
  } catch (e) {
    yield put(actions.getCommonDetail.failure(e));
  }
}

function* commonsSaga() {
  yield takeLatest(actions.getCommonsList.request, getCommonsList);
  yield takeLatest(actions.getCommonDetail.request, getCommonDetail);
}

export default commonsSaga;
