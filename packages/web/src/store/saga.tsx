import { all, fork } from "redux-saga/effects";

import { saga as authSaga } from "../containers/Auth/store";

const allSagas = [authSaga];

export default function* appSagas() {
  yield all(allSagas.map(fork));
}
