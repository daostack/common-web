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
  Proposals = "proposals",
}

export enum DateFormat {
  Long = "DD-MM-YYYY HH:mm",
  Short = "YYYY-MM-DD"
}
