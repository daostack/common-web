import firebase from "@/shared/utils/firebase";

export interface Time {
  seconds: number;
  nanoseconds: number;
  toDate: firebase.firestore.Timestamp["toDate"];
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
  Payments = "payments",
  Subscriptions = "subscriptions",
  Notifications = "notification",
}

export enum DateFormat {
  Long = "DD-MM-YYYY HH:mm",
  Short = "YYYY-MM-DD",
  Human = "MMM, D YYYY",
  LongHuman = "D MMMM YYYY",
  FullHuman = "MMMM DD, YYYY",
  GeneralHuman = "D MMMM YYYY",
  ShortSecondary = "DD/MM/YYYY",
  ShortWithDots = "DD.MM.YY",
}
