import { Report } from "./Report";

import { User } from ".";

export enum DiscussionMessageType {
  Message = "Message",
}

export enum DiscussionMessageFlag {
  Clear = "Clear",
  Reported = "Reported",
  Hidden = "Hidden",
}

export interface DiscussionMessage {
  id: string;
  message: string;
  type: DiscussionMessageType;
  flag: DiscussionMessageFlag;
  reports: Array<Report>;
  createTime: Date;
  owner?: User;
}
