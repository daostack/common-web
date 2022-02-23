import { all, fork } from "redux-saga/effects";

import { saga as authSaga } from "../containers/Auth/store";
import { commonsSaga } from "../containers/Common/store";
import { trusteeSaga } from "../containers/Trustee/store";
import { landingSaga } from "../containers/Landing/store";

const allSagas = [authSaga, commonsSaga, trusteeSaga, landingSaga];

export default function* appSagas() {
  yield all(allSagas.map(fork));
}
