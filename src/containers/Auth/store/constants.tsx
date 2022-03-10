export enum AuthActionTypes {
  SOCIAL_LOGIN = "@@AUTH/SOCIAL_LOGIN",
  SOCIAL_LOGIN_SUCCESS = "@@AUTH/SOCIAL_LOGIN_SUCCESS",
  SOCIAL_LOGIN_FAILURE = "@@AUTH/SOCIAL_LOGIN_FAILURE",

  LOGIN_USING_EMAIL_AND_PASSWORD = "@@AUTH/LOGIN_USING_EMAIL_AND_PASSWORD",
  LOGIN_USING_EMAIL_AND_PASSWORD_SUCCESS = "@@AUTH/LOGIN_USING_EMAIL_AND_PASSWORD_SUCCESS",
  LOGIN_USING_EMAIL_AND_PASSWORD_FAILURE = "@@AUTH/LOGIN_USING_EMAIL_AND_PASSWORD_FAILURE",

  SEND_VERIFICATION_CODE = "@@AUTH/SEND_VERIFICATION_CODE",
  SEND_VERIFICATION_CODE_SUCCESS = "@@AUTH/SEND_VERIFICATION_CODE_SUCCESS",
  SEND_VERIFICATION_CODE_FAILURE = "@@AUTH/SEND_VERIFICATION_CODE_FAILURE",

  CONFIRM_VERIFICATION_CODE = "@@AUTH/CONFIRM_VERIFICATION_CODE",
  CONFIRM_VERIFICATION_CODE_SUCCESS = "@@AUTH/CONFIRM_VERIFICATION_CODE_SUCCESS",
  CONFIRM_VERIFICATION_CODE_FAILURE = "@@AUTH/CONFIRM_VERIFICATION_CODE_FAILURE",

  LOG_OUT = "@@AUTH/LOG_OUT",

  UPDATE_USER_DATA = "@@AUTH/UPDATE_USER_DATA",
  UPDATE_USER_DATA_SUCCESS = "@@AUTH/UPDATE_USER_DATA_SUCCESS",
  UPDATE_USER_DATA_FAILURE = "@@AUTH/UPDATE_USER_DATA_FAILURE",

  SET_IS_NEW_USER = "@@AUTH/SET_IS_NEW_USER",

  SET_IS_LOGIN_MODAL_SHOWING = "@@AUTH/SET_IS_LOGIN_MODAL_SHOWING",

  START_AUTH_LOADING = "@@AUTH/START_AUTH_LOADING",
  STOP_AUTH_LOADING = "@@AUTH/STOP_AUTH_LOADING",

  SET_AUTH_PROVIDER = "@@AUTH/SET_AUTH_PROVIDER",

  SET_USER_PHONE_NUMBER = "@@AUTH/SET_USER_PHONE_NUMBER",
}
