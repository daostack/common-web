import firebase from "firebase/app";
import { ProposalsTypes } from "@/shared/constants";
import { circleIndex } from "../Circles";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SurveyArgs extends BasicArgsProposal {}

export interface Survey extends BaseProposal {
  data: {
    votingExpiresOn: firebase.firestore.Timestamp | null;
    discussionExpiresOn: firebase.firestore.Timestamp | null;
    args: SurveyArgs;
  };
  type: ProposalsTypes.SURVEY;
  local: {
    defaultCircle: circleIndex;
    optimisticAdmittance: boolean;
  };
}
