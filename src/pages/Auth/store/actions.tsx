import { User as FirebaseUser } from "firebase/auth";
import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { FirebaseCredentials } from "@/shared/interfaces/FirebaseCredentials";
import { AuthProvider } from "../../../shared/constants";
import { PayloadWithOptionalCallback } from "../../../shared/interfaces";
import { User } from "../../../shared/models";
import firebase from "../../../shared/utils/firebase";
import { LoginModalState } from "../../Auth/interface/LoginModalState";
import { AuthActionTypes } from "./constants";

export const socialLogin = createAsyncAction(
  AuthActionTypes.SOCIAL_LOGIN,
  AuthActionTypes.SOCIAL_LOGIN_SUCCESS,
  AuthActionTypes.SOCIAL_LOGIN_FAILURE,
)<
  PayloadWithOptionalCallback<
    { provider: AuthProvider; authCode: string },
    { user: User; isNewUser: boolean },
    Error
  >,
  User,
  Error
>();

export const loginWithFirebaseUser = createAsyncAction(
  AuthActionTypes.LOGIN_WITH_FIREBASE_USER,
  AuthActionTypes.LOGIN_WITH_FIREBASE_USER_SUCCESS,
  AuthActionTypes.LOGIN_WITH_FIREBASE_USER_FAILURE,
)<
  PayloadWithOptionalCallback<
    { firebaseUser: firebase.User | FirebaseUser | null; authCode: string },
    { user: User; isNewUser: boolean },
    Error
  >,
  User,
  Error
>();

export const webviewLogin = createAsyncAction(
  AuthActionTypes.WEBVIEW_LOGIN,
  AuthActionTypes.WEBVIEW_LOGIN_SUCCESS,
  AuthActionTypes.WEBVIEW_LOGIN_FAILURE,
)<
  PayloadWithOptionalCallback<
    FirebaseCredentials,
    { user: User; isNewUser: boolean },
    boolean
  >,
  User,
  Error
>();

export const webviewLoginWithUser = createAsyncAction(
  AuthActionTypes.WEBVIEW_LOGIN_WITH_USER,
  AuthActionTypes.WEBVIEW_LOGIN_WITH_USER_SUCCESS,
  AuthActionTypes.WEBVIEW_LOGIN_WITH_USER_FAILURE,
)<
  PayloadWithOptionalCallback<
    { user: firebase.User | FirebaseUser },
    { user: User; isNewUser: boolean },
    boolean
  >,
  User,
  Error
>();

export const loginUsingEmailAndPassword = createAsyncAction(
  AuthActionTypes.LOGIN_USING_EMAIL_AND_PASSWORD,
  AuthActionTypes.LOGIN_USING_EMAIL_AND_PASSWORD_SUCCESS,
  AuthActionTypes.LOGIN_USING_EMAIL_AND_PASSWORD_FAILURE,
)<
  PayloadWithOptionalCallback<{ email: string; password: string }, User, Error>,
  User,
  Error
>();

export const sendVerificationCode = createAsyncAction(
  AuthActionTypes.SEND_VERIFICATION_CODE,
  AuthActionTypes.SEND_VERIFICATION_CODE_SUCCESS,
  AuthActionTypes.SEND_VERIFICATION_CODE_FAILURE,
)<
  PayloadWithOptionalCallback<string, firebase.auth.ConfirmationResult, Error>,
  firebase.auth.ConfirmationResult,
  Error
>();

export const confirmVerificationCode = createAsyncAction(
  AuthActionTypes.CONFIRM_VERIFICATION_CODE,
  AuthActionTypes.CONFIRM_VERIFICATION_CODE_SUCCESS,
  AuthActionTypes.CONFIRM_VERIFICATION_CODE_FAILURE,
)<
  PayloadWithOptionalCallback<
    {
      confirmation: firebase.auth.ConfirmationResult;
      code: string;
      authCode: string;
    },
    { user: User; isNewUser: boolean },
    Error
  >,
  User,
  Error
>();

export const logOut = createStandardAction(AuthActionTypes.LOG_OUT)();

export const updateUserDetails = createAsyncAction(
  AuthActionTypes.UPDATE_USER_DATA,
  AuthActionTypes.UPDATE_USER_DATA_SUCCESS,
  AuthActionTypes.UPDATE_USER_DATA_FAILURE,
)<
  { user: User; callback: (error: Error | null, user?: User) => void },
  User,
  Error
>();

export const setLoginModalState = createStandardAction(
  AuthActionTypes.SET_LOGIN_MODAL_STATE,
)<LoginModalState>();

export const startAuthLoading = createStandardAction(
  AuthActionTypes.START_AUTH_LOADING,
)();

export const stopAuthLoading = createStandardAction(
  AuthActionTypes.STOP_AUTH_LOADING,
)();

export const setAuthProvider = createStandardAction(
  AuthActionTypes.SET_AUTH_PROVIDER,
)<AuthProvider | null>();

export const setUserPhoneNumber = createStandardAction(
  AuthActionTypes.SET_USER_PHONE_NUMBER,
)<string | null>();

export const setIsAuthenticationReady = createStandardAction(
  AuthActionTypes.SET_IS_AUTHENTICATION_READY,
)<boolean>();

export const deleteUser = createAsyncAction(
  AuthActionTypes.DELETE_USER,
  AuthActionTypes.DELETE_USER_SUCCESS,
  AuthActionTypes.DELETE_USER_FAILURE,
)<PayloadWithOptionalCallback<void, void, Error>, void, Error>();

export const setUserStreamsWithNotificationsAmount = createStandardAction(
  AuthActionTypes.SET_USER_STREAMS_WITH_NOTIFICATIONS_AMOUNT,
)<number | null>();
