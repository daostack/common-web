import { call, put, select } from "redux-saga/effects";
import { GovernanceService } from "@/services";
import { FirestoreDataSource } from "@/shared/constants";
import { Awaited, LoadingState } from "@/shared/interfaces";
import { Governance } from "@/shared/models";
import { isError } from "@/shared/utils";
import * as actions from "../actions";
import { selectGovernanceStateByCommonId } from "../selectors";

const getStateAction = actions.getGovernanceStateByCommonId;
const updateStateAction = actions.updateGovernanceStateByCommonId;
const requestFunction = GovernanceService.getGovernanceByCommonId;
const selectState = selectGovernanceStateByCommonId;

type State = LoadingState<Governance | null>;

export function* getGovernanceStateByCommonId({
  payload,
}: ReturnType<typeof getStateAction.request>) {
  const { commonId, force } = payload.payload;

  try {
    if (!force) {
      const state = ((yield select(selectState(commonId))) as State) || null;

      if (state?.fetched || state?.loading) {
        return;
      }
    }

    yield put(
      updateStateAction({
        commonId,
        state: {
          loading: true,
          fetched: false,
          data: null,
        },
      }),
    );
    const data = (yield call(
      requestFunction,
      commonId,
      force ? FirestoreDataSource.Server : FirestoreDataSource.Default,
    )) as Awaited<ReturnType<typeof requestFunction>>;

    yield put(
      updateStateAction({
        commonId,
        state: {
          loading: false,
          fetched: true,
          data,
        },
      }),
    );
    yield put(getStateAction.success(data));

    if (payload.callback) {
      payload.callback(null, data);
    }
  } catch (error) {
    yield put(
      updateStateAction({
        commonId,
        state: {
          loading: false,
          fetched: true,
          data: null,
        },
      }),
    );

    if (isError(error)) {
      yield put(getStateAction.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  }
}
