import { ScreenSize } from "../constants";

import { NotificationData } from "./";

export interface SharedStateType {
  loading: boolean;
  notification: NotificationData | null;
  screenSize: ScreenSize;
  shareLinks: Record<string, string>;
  loadingShareLinks: Record<string, boolean>;
}
