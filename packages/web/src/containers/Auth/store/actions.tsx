import { createAsyncAction } from "typesafe-actions";

import { AuthActionTypes } from "./constants";
import { AuthShape, RegisterShape } from "../interface";
import { User } from "../../../shared/models";

export const getUserData = createAsyncAction(
  AuthActionTypes.CHECK_USER,
  AuthActionTypes.CHECK_USER_SUCCESS,
  AuthActionTypes.CHECK_USER_FAILURE,
)<undefined, User, Error>();

export const login = createAsyncAction(
  AuthActionTypes.LOGIN,
  AuthActionTypes.LOGIN_SUCCESS,
  AuthActionTypes.LOGIN_FAILURE,
)<AuthShape, undefined, Error>();

export const logout = createAsyncAction(
  AuthActionTypes.LOGOUT,
  AuthActionTypes.LOGOUT_SUCCESS,
  AuthActionTypes.LOGOUT_FAILURE,
)<undefined, undefined, Error>();

export const registration = createAsyncAction(
  AuthActionTypes.REGISTRATION,
  AuthActionTypes.REGISTRATION_SUCCESS,
  AuthActionTypes.REGISTRATION_FAILURE,
)<RegisterShape, undefined, Error>();
