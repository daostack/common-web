import { call, put, takeLatest } from "redux-saga/effects";
import { AnyAction } from "redux";

import { tokenHandler } from "../../../shared/utils";
import * as actions from "./actions";
import firebase from "../../../shared/utils/firebase";
import { startLoading, stopLoading } from "../../../shared/store/actions";
import { User } from "../../../shared/models";
import { GoogleAuthResultInterface } from "../interface";

const authorizeUser = async (payload: string) => {
  const provider =
    payload === "google" ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.OAuthProvider("apple.com");

  return await firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      const credentials = result.credential?.toJSON() as GoogleAuthResultInterface;
      const user = result.user?.toJSON() as User;
      if (credentials && user) {
        tokenHandler.set(credentials.oauthAccessToken);
        tokenHandler.setUser(user);
      }
      return user;
    });
};

function* socialLoginSaga({ payload }: AnyAction & { payload: string }) {
  try {
    yield put(startLoading());

    const user: User = yield call(authorizeUser, payload);

    yield put(actions.socialLogin.success(user));
  } catch (error) {
    yield put(actions.socialLogin.failure(error));
  } finally {
    yield put(stopLoading());
  }
}

function* logOut() {
  yield localStorage.clear();
}

function* authSagas() {
  yield takeLatest(actions.socialLogin.request, socialLoginSaga);
  yield takeLatest(actions.logOut, logOut);
}

export default authSagas;
