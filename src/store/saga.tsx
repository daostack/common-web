import { all, fork } from "redux-saga/effects";
import { saga as authSaga } from "../pages/Auth/store";
import { landingSaga } from "../pages/Landing/store";
import { commonsSaga } from "../pages/OldCommon/store";
import { trusteeSaga } from "../pages/Trustee/store";
import { saga } from "../shared/store";
import {
  cacheSaga,
  commonSaga,
  commonLayoutSaga,
  commonFeedFollowsSaga,
  inboxSaga,
  projectsSaga,
} from "./states";

const allSagas = [
  authSaga,
  commonsSaga,
  trusteeSaga,
  landingSaga,
  projectsSaga,
  commonSaga,
  commonLayoutSaga,
  commonFeedFollowsSaga,
  cacheSaga,
  inboxSaga,
  saga,
];

export default function* appSagas() {
  yield all(allSagas.map(fork));
}
