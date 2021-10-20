import { User } from "./User";

enum ReportStatus {
  Active = "Active",
  Clossed = "Clossed",
}

export enum ReportFor {
  Nudity = "Nudity",
  Violance = "Violance",
  Harassment = "Harassment",
  FalseNews = "FalseNews",
  Spam = "Spam",
  Hate = "Hate",
  Other = "Other",
}

export interface Report {
  status: ReportStatus;
  for: ReportFor;
  note: string;
  reviewedOn: Date;
  reporterId: string;
  reporter: User;
  messageId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
