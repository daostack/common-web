export interface Time {
  seconds: number;
  nanoseconds: number;
}

export interface Moderation {
  flag: string;
  moderator: string;
  moderatorNote: string;
  reasons: string[];
  reporter: string;
  updatedAt: Time;
}

export interface File {
  value: string;
}

export enum Collection {
  Cards = "cards",
}

export type DateFormat = "DD-MM-YYYY HH:mm" | "YYYY-MM-DD";
