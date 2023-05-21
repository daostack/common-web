import { call, put } from "redux-saga/effects";
import { DiscussionService } from "@/services";
import { isError } from "@/shared/utils";
import { cacheActions } from "../../cache";
import * as actions from "../actions";
import { uploadDiscussionFiles } from "./utils";

export function* editDiscussion(
  action: ReturnType<typeof actions.editDiscussion.request>,
) {
  const { payload } = action;

  try {
    const files = yield call(uploadDiscussionFiles, payload.payload.files);
    const images = yield call(uploadDiscussionFiles, payload.payload.images);
    const discussion = (yield call(DiscussionService.editDiscussion, {
      ...payload.payload,
      files,
      images,
    })) as Awaited<ReturnType<typeof DiscussionService.editDiscussion>>;

    yield put(
      cacheActions.updateDiscussionStateById({
        discussionId: discussion.id,
        state: {
          loading: false,
          fetched: true,
          data: discussion,
        },
      }),
    );

    yield put(actions.setCommonAction(null));
    yield put(actions.editDiscussion.success(discussion));

    if (payload.callback) {
      payload.callback(null, discussion);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.editDiscussion.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  }
}
