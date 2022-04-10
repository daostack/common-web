export type NOTIFICATION_APPEARANCE = "error" | "info" | "success" | "warning";

export interface Notification {
  message: string;
  appearance: NOTIFICATION_APPEARANCE;
}

export interface NotificationData {
  notification_id: string;
  type: string;
  notification_date: Date;
  title: string;
  content: string;
  action_title: string;
  additional_information: string;
}
