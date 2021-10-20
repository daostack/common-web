import { createStandardAction } from "typesafe-actions";

import { ScreenSize } from "../constants";
import { Notification } from "../interfaces";
import { SharedActionTypes } from "./constants";

export const startLoading = createStandardAction(SharedActionTypes.START_LOADING)();
export const stopLoading = createStandardAction(SharedActionTypes.STOP_LOADING)();
export const showNotification = createStandardAction(SharedActionTypes.SHOW_NOTIFICATION)<Notification>();
export const changeScreenSize = createStandardAction(SharedActionTypes.CHANGE_SCREEN_SIZE)<ScreenSize>();
