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
  Discussion = "discussion",
  Users = "users",
  Daos = "daos",
  DiscussionMessage = "discussionMessage",
}

export enum DateFormat {
  Long = "DD-MM-YYYY HH:mm",
  Short = "YYYY-MM-DD",
  Human = "MMM, D YYYY",
}
