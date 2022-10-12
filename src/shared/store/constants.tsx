export enum SharedActionTypes {
  START_LOADING = "@@SHARED/START_LOADING",
  STOP_LOADING = "@@SHARED/STOP_LOADING",
  SHOW_NOTIFICATION = "@@SHARED/SHOW_NOTIFICATION",
  CHANGE_SCREEN_SIZE = "@@SHARED/CHANGE_SCREEN_SIZE",
  SET_ARE_REPORTS_LOADING = "@TRUSTEE/SET_ARE_REPORTS_LOADING",

  BUILD_SHARE_LINK = "@@SHARED/BUILD_SHARE_LINK",
  BUILD_SHARE_LINK_SUCCESS = "@@SHARED/BUILD_SHARE_LINK_SUCCESS",
  BUILD_SHARE_LINK_FAILURE = "@@SHARED/BUILD_SHARE_LINK_FAILURE",

  RESET_HEADER_STATE = "@@SHARED/RESET_HEADER_STATE",
  UPDATE_HEADER_STATE = "@@SHARED/UPDATE_HEADER_STATE",

  RESET_FOOTER_STATE = "@@SHARED/RESET_FOOTER_STATE",
  UPDATE_FOOTER_STATE = "@@SHARED/UPDATE_FOOTER_STATE",

  SET_TUTORIAL_MODAL_STATE = "@@SHARED/SET_TUTORIAL_MODAL_STATE",

  CHANGE_LANGUAGE = "@@SHARED/CHANGE_LANGUAGE",
}
