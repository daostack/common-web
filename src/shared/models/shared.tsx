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
  Governance = "governance",
  Cards = "cards",
  ChatChannel = "chatChannel",
  Proposals = "proposals",
  Discussion = "discussion",
  Users = "users",
  Daos = "daos",
  DiscussionMessage = "discussionMessage",
  Payments = "payments",
  Subscriptions = "subscriptions",
  Supporters = "supporters",
  Notifications = "notification",
  BankAccountDetails = "bankAccountDetails",
}

export enum SubCollections {
  Members = "members",
  Votes = "votes",
  ChatMessagesUserUnique = "chatMessagesUserUnique",
  CommonFeed = "commonFeed",
  CommonFeedObjectUserUnique = "commonFeedObjectUserUnique",
  Inbox = "Inbox",
  FeedItemFollows = "feedItemFollows",
}

export enum DateFormat {
  Long = "DD-MM-YYYY HH:mm",
  LongSlashed = "DD/MM/YYYY HH:mm",
  Short = "YYYY-MM-DD",
  Human = "MMM, D YYYY",
  LongHuman = "D MMMM YYYY",
  FullHuman = "MMMM DD, YYYY",
  GeneralHuman = "D MMMM YYYY",
  ShortSecondary = "DD/MM/YYYY",
  SuperShortSecondary = "D/M/YYYY",
  ShortWithDots = "DD.MM.YY",
  FullTime = "HH:mm:ss",
  GeneralTime = "HH:mm",
}
