import { ProposalsTypes } from "@/shared/constants/governance";
import { Timestamp } from "../../Timestamp";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

export interface AssignCircleArgs extends BasicArgsProposal {
  circleId: string;
  userId: string;
}

export interface AssignCircle extends BaseProposal {
  data: {
    votingExpiresOn: Timestamp | null;
    discussionExpiresOn: Timestamp | null;
    args: AssignCircleArgs;
  };
  type: ProposalsTypes.ASSIGN_CIRCLE;
}
