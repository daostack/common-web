import { Language, ScreenSize } from "../constants";
import { NotificationData } from "./";

export interface SharedHeaderState {
  shouldShowMenuItems: boolean | null;
  shouldShowDownloadLinks: boolean | null;
  shouldShowAuth: boolean | null;
}

export interface SharedStateType {
  loading: boolean;
  notification: NotificationData | null;
  screenSize: ScreenSize;
  shareLinks: Record<string, string>;
  loadingShareLinks: Record<string, boolean>;
  areReportsLoading: boolean;
  header: SharedHeaderState;
  language: Language;
}
