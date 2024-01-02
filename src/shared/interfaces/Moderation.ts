import { Timestamp } from "@/shared/models";

export enum ModerationFlags {
  Visible = "visible",
  Reported = "reported",
  Hidden = "hidden",
}

export interface Moderation {
  flag: ModerationFlags;
  reasons: string[];
  moderatorNote: string | null;
  updatedAt: Timestamp | null;
  moderator: string[];
  reporter: string | null;
}
