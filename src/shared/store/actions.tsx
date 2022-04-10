import { createAsyncAction, createStandardAction } from "typesafe-actions";

import { ScreenSize } from "../constants";
import { NotificationData, PayloadWithOptionalCallback } from "../interfaces";
import { DynamicLinkInfo } from "../interfaces/api/dynamicLink";
import { SharedActionTypes } from "./constants";

export const startLoading = createStandardAction(
  SharedActionTypes.START_LOADING
)();
export const stopLoading = createStandardAction(
  SharedActionTypes.STOP_LOADING
)();

export const showNotification = createStandardAction(
  SharedActionTypes.SHOW_NOTIFICATION
)<NotificationData | null>();

export const changeScreenSize = createStandardAction(
  SharedActionTypes.CHANGE_SCREEN_SIZE
)<ScreenSize>();

export const buildShareLink = createAsyncAction(
  SharedActionTypes.BUILD_SHARE_LINK,
  SharedActionTypes.BUILD_SHARE_LINK_SUCCESS,
  SharedActionTypes.BUILD_SHARE_LINK_FAILURE
)<
  PayloadWithOptionalCallback<
    { key: string; linkInfo: DynamicLinkInfo },
    string,
    Error
  >,
  { key: string; link: string },
  { key: string; error: Error }
>();
