import { ScreenSize } from "../constants";

import { Notification } from "./";

export interface SharedStateType {
  loading: boolean;
  notification: Notification | null;
  screenSize: ScreenSize;
  shareLinks: Record<string, string>;
  loadingShareLinks: Record<string, boolean>;
  areReportsLoading: boolean;
}
