import { all, fork } from "redux-saga/effects";
import { saga as authSaga } from "../pages/Auth/store";
import { commonsSaga } from "../pages/Common/store";
import { landingSaga } from "../pages/Landing/store";
import { trusteeSaga } from "../pages/Trustee/store";
import { saga } from "../shared/store";

const allSagas = [authSaga, commonsSaga, trusteeSaga, landingSaga, saga];

export default function* appSagas() {
  yield all(allSagas.map(fork));
}
