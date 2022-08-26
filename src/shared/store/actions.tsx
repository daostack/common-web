import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { Language, ScreenSize } from "../constants";
import {
  NotificationData,
  PayloadWithOptionalCallback,
  SharedHeaderState,
} from "../interfaces";
import { DynamicLinkInfo } from "../interfaces/api/dynamicLink";
import { SharedActionTypes } from "./constants";

export const startLoading = createStandardAction(SharedActionTypes.START_LOADING)();
export const stopLoading = createStandardAction(SharedActionTypes.STOP_LOADING)();
export const showNotification = createStandardAction(SharedActionTypes.SHOW_NOTIFICATION)<NotificationData | null>();
export const changeScreenSize = createStandardAction(SharedActionTypes.CHANGE_SCREEN_SIZE)<ScreenSize>();
export const setAreReportsLoading = createStandardAction(
  SharedActionTypes.SET_ARE_REPORTS_LOADING
)<boolean>();

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

export const resetHeaderState = createStandardAction(
  SharedActionTypes.RESET_HEADER_STATE
)();
export const updateHeaderState = createStandardAction(
  SharedActionTypes.UPDATE_HEADER_STATE
)<Partial<SharedHeaderState>>();

export const changeLanguage = createStandardAction(
  SharedActionTypes.CHANGE_LANGUAGE
)<Language>();
