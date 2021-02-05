import { call, put, takeLatest } from "redux-saga/effects";
import { AnyAction } from "redux";

import history from "../../../shared/history";
import { tokenHandler } from "../../../shared/utils";
import * as actions from "./actions";
import firebase from "../../../shared/utils/firebase";

import { startLoading, stopLoading } from "../../../shared/store/actions";
import { GoogleAuthInterface } from "../interface";

function* googleSignInSaga({ payload }: AnyAction & { payload: GoogleAuthInterface }) {
  try {
    const { _token } = payload;
    const { idToken, accessToken } = _token;
    const user = yield call(firebase.auth.GoogleAuthProvider.credential, idToken, accessToken);

    console.log(JSON.stringify(user, null, 2));
    yield put(startLoading());

    yield history.push("/");

    yield put(stopLoading());
  } catch (error) {
    console.log(error);
    yield put(stopLoading());
    yield put(actions.googleSignIn.failure(error));
  }
}

function* authSagas() {
  yield takeLatest(actions.googleSignIn.request, googleSignInSaga);
}

export default authSagas;
