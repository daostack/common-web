import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { User } from "../../../shared/models";

import { AuthActionTypes } from "./constants";

export const socialLogin = createAsyncAction(
  AuthActionTypes.SOCIAL_LOGIN,
  AuthActionTypes.SOCIAL_LOGIN_SUCCESS,
  AuthActionTypes.SOCIAL_LOGIN_FAILURE,
)<string, User, Error>();

export const logOut = createStandardAction(AuthActionTypes.LOG_OUT)();
