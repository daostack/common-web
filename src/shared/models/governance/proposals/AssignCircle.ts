import firebase from "firebase/app";
import { ProposalsTypes } from "@/shared/constants/governance";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

export interface AssignCircleArgs extends BasicArgsProposal {
  circleId: string;
}

export interface AssignCircle extends BaseProposal {
  data: {
    votingExpiresOn: firebase.firestore.Timestamp | null;
    discussionExpiresOn: firebase.firestore.Timestamp | null;
    args: AssignCircleArgs;
  };
  type: ProposalsTypes.ASSIGN_CIRCLE;
}
