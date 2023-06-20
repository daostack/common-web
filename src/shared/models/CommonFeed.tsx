import { DiscussionMessageOwnerType } from "@/shared/constants";
import { BaseEntity } from "./BaseEntity";
import { SoftDeleteEntity } from "./SoftDeleteEntity";

export enum CommonFeedType {
  Proposal = "Proposal",
  Discussion = "Discussion",
  PayIn = "PayIn",
  ProjectCreation = "ProjectCreation",
  JoinCommon = "JoinCommon",
  JoinProjectInCommon = "JoinProjectInCommon",
}

export interface CommonFeed extends BaseEntity, SoftDeleteEntity {
  userId: string;
  data: Record<string, unknown> & {
    type: CommonFeedType;
    id: string;
    discussionId: string | null;
    lastMessage?: {
      userName: string;
      content: string;
      ownerType?: DiscussionMessageOwnerType;
    };
    hasFiles?: boolean;
    hasImages?: boolean;
  };
  circleVisibility: string[];
}
