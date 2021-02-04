export type NOTIFICATION_APPEARANCE = "error" | "info" | "success" | "warning";

export interface Notification {
  message: string;
  appearance: NOTIFICATION_APPEARANCE;
}
