import { Report } from "./Report";

import { Time, User } from ".";

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
  discussionId: string;
  ownerId: string;
  message: string;
  type: DiscussionMessageType;
  flag: DiscussionMessageFlag;
  reports: Array<Report>;
  createTime: Time;
  owner?: User;
}
