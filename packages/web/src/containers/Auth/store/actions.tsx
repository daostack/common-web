import { createAsyncAction, createStandardAction } from "typesafe-actions";

import { User } from "../../../shared/models";
import { AuthActionTypes } from "./constants";

export const socialLogin = createAsyncAction(
  AuthActionTypes.SOCIAL_LOGIN,
  AuthActionTypes.SOCIAL_LOGIN_SUCCESS,
  AuthActionTypes.SOCIAL_LOGIN_FAILURE,
)<string, User, Error>();

export const logOut = createStandardAction(AuthActionTypes.LOG_OUT)();

export const updateUserDetails = createAsyncAction(
  AuthActionTypes.UPDATE_USER_DATA,
  AuthActionTypes.UPDATE_USER_DATA_SUCCESS,
  AuthActionTypes.UPDATE_USER_DATA_FAILURE,
)<{ user: User; callback: () => void }, User, Error>();

export const setIsUserNew = createStandardAction(AuthActionTypes.SET_IS_NEW_USER)<boolean>();
