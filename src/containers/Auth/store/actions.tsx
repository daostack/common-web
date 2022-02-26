import { createAsyncAction, createStandardAction } from "typesafe-actions";

import { AuthActionTypes } from "./constants";
import { AuthProvider } from "../../../shared/constants";
import { PayloadWithOptionalCallback } from "../../../shared/interfaces";
import { User } from "../../../shared/models";

export const socialLogin = createAsyncAction(
  AuthActionTypes.SOCIAL_LOGIN,
  AuthActionTypes.SOCIAL_LOGIN_SUCCESS,
  AuthActionTypes.SOCIAL_LOGIN_FAILURE
)<AuthProvider, User, Error>();

export const loginUsingEmailAndPassword = createAsyncAction(
  AuthActionTypes.LOGIN_USING_EMAIL_AND_PASSWORD,
  AuthActionTypes.LOGIN_USING_EMAIL_AND_PASSWORD_SUCCESS,
  AuthActionTypes.LOGIN_USING_EMAIL_AND_PASSWORD_FAILURE
)<
  PayloadWithOptionalCallback<{ email: string; password: string }, User, Error>,
  User,
  Error
>();

export const logOut = createStandardAction(AuthActionTypes.LOG_OUT)();

export const updateUserDetails = createAsyncAction(
  AuthActionTypes.UPDATE_USER_DATA,
  AuthActionTypes.UPDATE_USER_DATA_SUCCESS,
  AuthActionTypes.UPDATE_USER_DATA_FAILURE
)<{ user: User; callback: () => void }, User, Error>();

export const setIsUserNew = createStandardAction(
  AuthActionTypes.SET_IS_NEW_USER
)<boolean>();

export const setIsLoginModalShowing = createStandardAction(
  AuthActionTypes.SET_IS_LOGIN_MODAL_SHOWING
)<boolean>();

export const setAuthProvider = createStandardAction(
  AuthActionTypes.SET_AUTH_PROVIDER
)<AuthProvider | null>();
