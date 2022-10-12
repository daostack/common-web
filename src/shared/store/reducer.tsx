import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import { Language, ScreenSize, SMALL_SCREEN_BREAKPOINT } from "../constants";
import { SharedStateType } from "../interfaces";
import * as actions from "./actions";

type Action = ActionType<typeof actions>;

const initialState: SharedStateType = {
  loading: false,
  notification: null,
  screenSize: window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`).matches
    ? ScreenSize.Desktop
    : ScreenSize.Mobile,
  shareLinks: {},
  loadingShareLinks: {},
  areReportsLoading: false,
  header: {
    shouldHideHeader: null,
    shouldShowMenuItems: null,
    shouldShowDownloadLinks: null,
    shouldShowAuth: null,
  },
  footer: {
    shouldHideFooter: null,
  },
  tutorialModalState: {
    isShowing: false,
  },
  language: Language.English,
  isRtlLanguage: false,
};

const reducer = createReducer<SharedStateType, Action>(initialState)
  .handleAction(actions.startLoading, (state) =>
    produce(state, (nextState) => {
      nextState.loading = true;
    })
  )
  .handleAction(actions.stopLoading, (state) =>
    produce(state, (nextState) => {
      nextState.loading = false;
    })
  )
  .handleAction(actions.showNotification, (state, action) =>
    produce(state, (nexState) => {
      nexState.notification = action.payload;
    })
  )
  .handleAction(actions.changeScreenSize, (state, action) =>
    produce(state, (nextState) => {
      nextState.screenSize = action.payload;
    })
  )
  .handleAction(actions.buildShareLink.request, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.loadingShareLinks = {
        ...nextState.loadingShareLinks,
        [payload.payload.key]: true,
      };
    })
  )
  .handleAction(actions.buildShareLink.success, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.shareLinks = {
        ...nextState.shareLinks,
        [payload.key]: payload.link,
      };
      nextState.loadingShareLinks = {
        ...nextState.loadingShareLinks,
        [payload.key]: false,
      };
    })
  )
  .handleAction(actions.buildShareLink.failure, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.loadingShareLinks = {
        ...nextState.loadingShareLinks,
        [payload.key]: false,
      };
    })
  )
  .handleAction(actions.setAreReportsLoading, (state, action) =>
    produce(state, (nextState) => {
      nextState.areReportsLoading = action.payload;
    })
  )
  .handleAction(actions.resetHeaderState, (state) =>
    produce(state, (nextState) => {
      nextState.header = {
        shouldHideHeader: null,
        shouldShowMenuItems: null,
        shouldShowDownloadLinks: null,
        shouldShowAuth: null,
      };
    })
  )
  .handleAction(actions.updateHeaderState, (state, action) =>
    produce(state, (nextState) => {
      nextState.header = {
        ...nextState.header,
        ...action.payload,
      };
    })
  )
  .handleAction(actions.resetFooterState, (state) =>
    produce(state, (nextState) => {
      nextState.footer = {
        shouldHideFooter: null,
      };
    })
  )
  .handleAction(actions.updateFooterState, (state, action) =>
    produce(state, (nextState) => {
      nextState.footer = {
        ...nextState.footer,
        ...action.payload,
      };
    })
  )
  .handleAction(actions.setTutorialModalState, (state, action) =>
    produce(state, (nextState) => {
      nextState.tutorialModalState = action.payload;
    })
  )
  .handleAction(actions.changeLanguage, (state, action) =>
    produce(state, (nextState) => {
      nextState.language = action.payload;
      nextState.isRtlLanguage = nextState.language === Language.Hebrew;
    })
  );

export { reducer as SharedReducer };
