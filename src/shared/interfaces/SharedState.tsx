import { Language, ScreenSize, Theme } from "../constants";
import { NotificationData } from "./";

export interface SharedHeaderState {
  shouldHideHeader: boolean | null;
  shouldShowMenuItems: boolean | null;
  shouldShowDownloadLinks: boolean | null;
  shouldShowAuth: boolean | null;
}

export interface SharedModalState {
  isShowing: boolean;
}

export interface SharedStateType {
  loading: boolean;
  notification: NotificationData | null;
  screenSize: ScreenSize;
  shareLinks: Record<string, string>;
  loadingShareLinks: Record<string, boolean>;
  areReportsLoading: boolean;
  header: SharedHeaderState;
  tutorialModalState: SharedModalState;
  language: Language;
  isRtlLanguage: boolean;
  theme: Theme;
}
