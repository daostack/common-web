import { ScreenSize } from "../../containers/App/constants";
import { Notification } from "./";

export interface SharedStateType {
  loading: boolean;
  notification: Notification | null;
  screenSize: ScreenSize;
}
