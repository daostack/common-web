import { EventTitleState, EventTypeState } from "@/shared/models/Notification";

export type NOTIFICATION_APPEARANCE = "error" | "info" | "success" | "warning";

export interface Notification {
  message: string;
  appearance: NOTIFICATION_APPEARANCE;
}

export interface NotificationData {
  notificationId: string;
  type: EventTypeState;
  notificationDate: Date;
  title: EventTitleState;
  content: string;
  actionTitle: string;
  additionalInformation: string;
}
