import { put, takeLatest } from "redux-saga/effects";
import { AnyAction } from "redux";

import history from "../../../shared/history";
import { tokenHandler } from "../../../shared/utils";
import * as actions from "./actions";
import firebase from "../../../shared/utils/firebase";

import { startLoading, stopLoading } from "../../../shared/store/actions";
import { User } from "../../../shared/models";
import { GoogleAuthResultInterface } from "../interface";

function* socialLoginSaga({ payload }: AnyAction & { payload: string }) {
  try {
    yield put(startLoading());
    const provider =
      payload === "google" ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.OAuthProvider("apple.com");

    yield firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const credentials = result.credential?.toJSON() as GoogleAuthResultInterface;
        const user = result.user?.toJSON() as User;
        if (credentials && user) {
          tokenHandler.set(credentials.oauthAccessToken);
          tokenHandler.setUser(user);
          history.push("/");
        }
      });
  } catch (error) {
    yield put(actions.socialLogin.failure(error));
  } finally {
    yield put(stopLoading());
  }
}

function* authSagas() {
  yield takeLatest(actions.socialLogin.request, socialLoginSaga);
}

export default authSagas;
