import { createAsyncAction } from "typesafe-actions";

import { AuthActionTypes } from "./constants";

export const socialLogin = createAsyncAction(
  AuthActionTypes.SOCIAL_LOGIN,
  AuthActionTypes.SOCIAL_LOGIN_SUCCESS,
  AuthActionTypes.SOCIAL_LOGIN_FAILURE,
)<string, undefined, Error>();
