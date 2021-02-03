import { call, put, takeLatest } from "redux-saga/effects";
import { AnyAction } from "redux";

import history from "../../../shared/history";
import { tokenHandler } from "../../../shared/utils";
import { getUserData, logout, login, registration } from "./actions";
import api from "../api";
import { AuthActionTypes } from "./constants";
import { startLoading, stopLoading } from "../../../shared/store/actions";

function* getUserDataSaga() {
  try {
    yield put(startLoading());

    const { email } = yield call(api.getUserInfo);
    yield put(getUserData.success(email));
    yield history.push("/");

    yield put(stopLoading());
  } catch (error) {
    yield put(stopLoading());
    yield put(getUserData.failure(error));
  }
}

function* logoutSaga() {
  yield localStorage.clear();
  yield put(logout.success());
  yield history.push("/auth");
}

function* registrationSaga({ payload }: AnyAction) {
  try {
    yield put(startLoading());
    const { token } = yield call(api.registration, payload);
    yield tokenHandler.set(token);
    yield put(getUserData.request());
    yield put(registration.success());
    yield put(stopLoading());
    history.push("/");
  } catch (error) {
    yield put(registration.failure(error));
    yield put(stopLoading());
  }
}

function* loginSaga({ payload }: AnyAction) {
  try {
    yield put(startLoading());
    const { token } = yield call(api.login, payload);
    yield tokenHandler.set(token);
    yield put(getUserData.request());
    yield put(login.success());
    yield put(stopLoading());
    history.push("/");
  } catch (error) {
    yield put(login.failure(error));
    yield put(stopLoading());
  }
}

function* authSagas() {
  yield takeLatest(AuthActionTypes.LOGOUT, logoutSaga);
  yield takeLatest(AuthActionTypes.LOGIN, loginSaga);
  yield takeLatest(AuthActionTypes.CHECK_USER, getUserDataSaga);
  yield takeLatest(AuthActionTypes.REGISTRATION, registrationSaga);
}

export default authSagas;
