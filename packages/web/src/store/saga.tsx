import { all, fork } from "redux-saga/effects";

import { saga as authSaga } from "../containers/Auth/store";
import { commonsSaga } from "../containers/Common/store";

const allSagas = [authSaga, commonsSaga];

export default function* appSagas() {
  yield all(allSagas.map(fork));
}
