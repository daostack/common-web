import { createAsyncAction, createStandardAction } from "typesafe-actions";

import { ScreenSize } from "../constants";
import { Notification, PayloadWithCallback } from "../interfaces";
import { DynamicLinkInfo } from "../interfaces/api/dynamicLink";
import { SharedActionTypes } from "./constants";

export const startLoading = createStandardAction(SharedActionTypes.START_LOADING)();
export const stopLoading = createStandardAction(SharedActionTypes.STOP_LOADING)();
export const showNotification = createStandardAction(SharedActionTypes.SHOW_NOTIFICATION)<Notification>();
export const changeScreenSize = createStandardAction(SharedActionTypes.CHANGE_SCREEN_SIZE)<ScreenSize>();

export const buildShareLink = createAsyncAction(
  SharedActionTypes.BUILD_SHARE_LINK,
  SharedActionTypes.BUILD_SHARE_LINK_SUCCESS,
  SharedActionTypes.BUILD_SHARE_LINK_FAILURE
)<PayloadWithCallback<DynamicLinkInfo, string, Error>, string, Error>();
