import { ProposalsTypes } from "@/shared/constants/governance";
import { Timestamp } from "../../Timestamp";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

export interface RemoveCircleArgs extends BasicArgsProposal {
  circleId: string;
  userId: string;
}

export interface RemoveCircle extends BaseProposal {
  data: {
    votingExpiresOn: Timestamp | null;
    discussionExpiresOn: Timestamp | null;
    args: RemoveCircleArgs;
  };
  type: ProposalsTypes.REMOVE_CIRCLE;
}
