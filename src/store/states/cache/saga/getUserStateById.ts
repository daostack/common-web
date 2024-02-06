import { call, put, select } from "redux-saga/effects";
import { UserService } from "@/services";
import { Awaited, LoadingState } from "@/shared/interfaces";
import { User } from "@/shared/models";
import { isError } from "@/shared/utils";
import * as actions from "../actions";
import { selectUserStateById } from "../selectors";

const getStateAction = actions.getUserStateById;
const updateStateAction = actions.updateUserStateById;
const requestFunction = UserService.getUserById;

type State = LoadingState<User | null>;

export function* getUserStateById({
  payload,
}: ReturnType<typeof getStateAction.request>) {
  const { userId } = payload.payload;

  try {
    const userState =
      ((yield select(selectUserStateById(userId))) as State) || null;

    if (userState?.fetched || userState?.loading) {
      return;
    }

    yield put(
      updateStateAction({
        userId,
        state: {
          loading: true,
          fetched: false,
          data: null,
        },
      }),
    );
    const user = (yield call(requestFunction, userId, true)) as Awaited<
      ReturnType<typeof requestFunction>
    >;

    yield put(
      updateStateAction({
        userId,
        state: {
          loading: false,
          fetched: true,
          data: user,
        },
      }),
    );
    yield put(getStateAction.success(user));

    if (payload.callback) {
      payload.callback(null, user);
    }
  } catch (error) {
    yield put(
      updateStateAction({
        userId,
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
