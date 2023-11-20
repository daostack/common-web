import { call, put, select } from "redux-saga/effects";
import { DiscussionService } from "@/services";
import { Awaited, LoadingState } from "@/shared/interfaces";
import { Discussion } from "@/shared/models";
import { isError } from "@/shared/utils";
import * as actions from "../actions";
import { selectDiscussionStateById } from "../selectors";

const getStateAction = actions.getDiscussionStateById;
const updateStateAction = actions.updateDiscussionStateById;
const requestFunction = DiscussionService.getDiscussionById;
const selectState = selectDiscussionStateById;

type State = LoadingState<Discussion | null>;

export function* getDiscussionStateById({
  payload,
}: ReturnType<typeof getStateAction.request>) {
  const { discussionId } = payload.payload;

  try {
    const state = ((yield select(selectState(discussionId))) as State) || null;
    if (discussionId === "7e9b9176-b091-4c94-b1f9-770c59a90556") {
      console.log("discussion state", state);
    }

    if (state?.fetched || state?.loading) {
      return;
    }

    yield put(
      updateStateAction({
        discussionId,
        state: {
          loading: true,
          fetched: false,
          data: null,
        },
      }),
    );
    const data = (yield call(requestFunction, discussionId)) as Awaited<
      ReturnType<typeof requestFunction>
    >;

    yield put(
      updateStateAction({
        discussionId,
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
    console.log(error);
    yield put(
      updateStateAction({
        discussionId,
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
