import { Notification } from "./";

export interface SharedStateType {
  loading: boolean;
  notification: Notification | null;
}
