import { call, put } from "redux-saga/effects";
import { DiscussionService } from "@/services";
import { Awaited, UploadFile } from "@/shared/interfaces";
import { CommonLink } from "@/shared/models";
import { isError } from "@/shared/utils";
import {
  getFileNameForUploading,
  uploadFile,
} from "@/shared/utils/firebaseUploadFile";
import * as cacheActions from "../../cache/actions";
import * as actions from "../actions";

const uploadDiscussionFiles = async (
  files?: UploadFile[],
): Promise<CommonLink[] | undefined> =>
  files &&
  (await Promise.all(
    files.map<Promise<CommonLink>>(async ({ title, file }) => {
      const fileName =
        typeof file === "string" ? title : getFileNameForUploading(file.name);
      const value =
        typeof file === "string"
          ? file
          : await uploadFile(fileName, "public_img", file);

      return {
        title: fileName,
        value,
      };
    }),
  ));

export function* createDiscussion(
  action: ReturnType<typeof actions.createDiscussion.request>,
) {
  const { payload } = action;

  try {
    const files = yield call(uploadDiscussionFiles, payload.payload.files);
    const images = yield call(uploadDiscussionFiles, payload.payload.images);
    const discussion = (yield call(DiscussionService.createDiscussion, {
      ...payload.payload,
      files,
      images,
    })) as Awaited<ReturnType<typeof DiscussionService.createDiscussion>>;

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
    yield put(actions.createDiscussion.success(discussion));

    if (payload.callback) {
      payload.callback(null, discussion);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.createDiscussion.failure(error));

      if (payload.callback) {
        payload.callback(error);
      }
    }
  }
}
