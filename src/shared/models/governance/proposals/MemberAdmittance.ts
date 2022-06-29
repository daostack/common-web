import firebase from "firebase/app";
import { ProposalsTypes } from "@/shared/constants";
import { circleIndex } from "../Circles";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

export interface MemberAdmittanceArgs extends BasicArgsProposal {
  circle?: string;
}

export interface MemberAdmittance extends BaseProposal {
  data: {
    votingExpiresOn: firebase.firestore.Timestamp | null;
    discussionExpiresOn: firebase.firestore.Timestamp | null;
    args: MemberAdmittanceArgs;
  };
  type: ProposalsTypes.MEMBER_ADMITTANCE;
  local: {
    defaultCircle: circleIndex;
    optimisticAdmittance: boolean;
  };
}
