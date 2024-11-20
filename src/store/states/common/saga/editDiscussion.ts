import { call, put } from "redux-saga/effects";
import { DiscussionService } from "@/services";
import { FileService } from "@/services";
import { isError } from "@/shared/utils";
import { cacheActions } from "../../cache";
import * as actions from "../actions";

export function* editDiscussion(
  action: ReturnType<typeof actions.editDiscussion.request>,
) {
  const { payload } = action;

  const commonId = payload.commonId;
  try {
    const files = yield FileService.uploadFiles(payload.payload.files || []);
    const images = yield FileService.uploadFiles(payload.payload.images || []);

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

    yield put(actions.setCommonAction({ action: null, commonId }));
    yield put(actions.editDiscussion.success({ discussion, commonId }));

    if (payload.callback) {
      payload.callback(null, discussion);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.editDiscussion.failure({ error, commonId }));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  }
}
