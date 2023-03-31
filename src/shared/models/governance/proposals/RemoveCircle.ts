import firebase from "firebase/app";
import { ProposalsTypes } from "@/shared/constants/governance";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

export interface RemoveCircleArgs extends BasicArgsProposal {
  circleId: string;
  userId: string;
}

export interface RemoveCircle extends BaseProposal {
  data: {
    votingExpiresOn: firebase.firestore.Timestamp | null;
    discussionExpiresOn: firebase.firestore.Timestamp | null;
    args: RemoveCircleArgs;
  };
  type: ProposalsTypes.REMOVE_CIRCLE;
}
