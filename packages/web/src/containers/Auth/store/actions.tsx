import { createAsyncAction } from "typesafe-actions";

import { AuthActionTypes } from "./constants";
import { User } from "../../../shared/models";
import { GoogleAuthInterface } from "../interface";

export const googleSignIn = createAsyncAction(
  AuthActionTypes.GOOGLE_SIGN_IN,
  AuthActionTypes.GOOGLE_SIGN_IN_SUCCESS,
  AuthActionTypes.GOOGLE_SIGN_IN_FAILURE,
)<GoogleAuthInterface, User, Error>();
