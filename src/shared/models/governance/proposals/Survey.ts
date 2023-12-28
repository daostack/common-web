import { ProposalsTypes } from "@/shared/constants";
import { Timestamp } from "../../Timestamp";
import { CircleIndex } from "../Circles";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SurveyArgs extends BasicArgsProposal {}

export interface Survey extends BaseProposal {
  data: {
    votingExpiresOn: Timestamp | null;
    discussionExpiresOn: Timestamp | null;
    args: SurveyArgs;
  };
  type: ProposalsTypes.SURVEY;
  local: {
    defaultCircle: CircleIndex;
    optimisticAdmittance: boolean;
  };
}
