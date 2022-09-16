import firebase from "firebase/app";
import { ProposalsTypes } from "@/shared/constants/governance";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

export type DeleteCommonArgs = BasicArgsProposal;

export interface DeleteCommon extends BaseProposal {
  data: {
    votingExpiresOn: firebase.firestore.Timestamp | null;
    discussionExpiresOn: firebase.firestore.Timestamp | null;
    args: DeleteCommonArgs;
  };
  type: ProposalsTypes.DELETE_COMMON;
}
