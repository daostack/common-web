import { BaseEntity } from "./BaseEntity";

export enum CommonFeedType {
  Proposal = "Proposal",
  Discussion = "Discussion",
  PayIn = "PayIn",
  ProjectCreation = "ProjectCreation",
  JoinCommon = "JoinCommon",
  JoinProjectInCommon = "JoinProjectInCommon",
}

export interface CommonFeed extends BaseEntity {
  userId: string;
  data: Record<string, unknown> & {
    type: CommonFeedType;
    id: string;
    discussionId: string;
    lastMessage?: {
      userName: string;
      content: string;
    };
  };
  circleVisibility: string[];
}
