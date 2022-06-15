import firebase from "firebase/app";
import { ProposalsTypes } from "@/shared/constants/governance";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

export interface RemoveCircleArgs extends BasicArgsProposal {
  circle: string;
}

export interface RemoveCircle extends BaseProposal {
  data: {
    expiresOn: firebase.firestore.Timestamp;
    args: RemoveCircleArgs;
  };
  type: ProposalsTypes.REMOVE_CIRCLE;
}
