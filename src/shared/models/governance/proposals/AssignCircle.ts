import firebase from "firebase/app";
import { ProposalsTypes } from "@/shared/constants/governance";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

export interface AssignCircleArgs extends BasicArgsProposal {
  circleId: string;
}

export interface AssignCircle extends BaseProposal {
  data: {
    expiresOn: firebase.firestore.Timestamp;
    args: AssignCircleArgs;
  };
  type: ProposalsTypes.ASSIGN_CIRCLE;
}
