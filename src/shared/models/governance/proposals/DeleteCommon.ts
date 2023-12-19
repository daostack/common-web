import { ProposalsTypes } from "@/shared/constants/governance";
import { Timestamp } from "../../Timestamp";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

export type DeleteCommonArgs = BasicArgsProposal;

export interface DeleteCommon extends BaseProposal {
  data: {
    votingExpiresOn: Timestamp | null;
    discussionExpiresOn: Timestamp | null;
    args: DeleteCommonArgs;
  };
  type: ProposalsTypes.DELETE_COMMON;
}
