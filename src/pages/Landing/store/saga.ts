import { put, takeLatest } from "redux-saga/effects";
import { startLoading, stopLoading } from "../../../shared/store/actions";
import { sendEmail as sendEmailApi } from "../../../shared/utils/sendEmail";
import * as actions from "./actions";

export function* sendEmail(
  action: ReturnType<typeof actions.sendEmail.request>,
): Generator {
  try {
    yield put(startLoading());
    yield sendEmailApi(action.payload.payload);

    yield put(actions.sendEmail.success());
    action.payload.callback(null);
    yield put(stopLoading());
  } catch (error: any) {
    yield put(actions.sendEmail.failure(error));
    action.payload.callback(error);
    yield put(stopLoading());
  }
}

function* landingSaga(): Generator {
  yield takeLatest(actions.sendEmail.request, sendEmail);
}

export default landingSaga;
