import {
  AssignCircle,
  FundsAllocation,
  FundsRequest,
  MemberAdmittance,
  RemoveCircle,
  Survey,
} from "@/shared/models/governance/proposals";
import { Discussion } from "./Discussion";
import { User } from "./User";

export enum ProposalState {
  PASSED = "passed",
  FAILED = "failed",
  VOTING = "voting",
  DISCUSSION = "discussion",
  RETRACTED = "retracted",
  COMPLETED = "completed",
}

export interface DocInfo<LegalType = number> {
  name: string;
  legalType: LegalType;
  amount?: number;
  mimeType: string;
  downloadURL: string;
}

export interface ProposalLink {
  title?: string;
  value: string;
}

interface ExtendedProposalOptions {
  proposer?: User;
  discussion?: Discussion;
}

export type Proposal = (
  | MemberAdmittance
  | FundsRequest
  | FundsAllocation
  | AssignCircle
  | RemoveCircle
  | Survey
) &
  ExtendedProposalOptions;

export type ProposalWithHighlightedComment = Proposal & {
  highlightedCommentId: string;
};

export interface ProposalListItem {
  proposal: Proposal;
  loadProposalDetails: (payload: Proposal) => void;
}

export const isProposalWithHighlightedComment = (
  proposal: any
): proposal is ProposalWithHighlightedComment =>
  proposal && proposal.highlightedCommentId;

export const isDocInfo = (data: any): data is DocInfo => data.downloadURL;
