import {
  AssignCircle,
  FundsAllocation,
  FundsRequest,
  MemberAdmittance,
  RemoveCircle,
} from "@/shared/models/governance/proposals";
import { DiscussionMessage } from "./DiscussionMessage";
import { User } from "./User";
import {CommonMember} from "@/shared/models/Common";

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
  discussionMessage?: DiscussionMessage[];
  proposer?: User;
}

export type Proposal = (
  | MemberAdmittance
  | FundsRequest
  | FundsAllocation
  | AssignCircle
  | RemoveCircle
) &
  ExtendedProposalOptions;

export type ProposalWithHighlightedComment = Proposal & {
  highlightedCommentId: string;
};

export interface ProposalListItem {
  proposal: Proposal;
  loadProposalDetails: (payload: Proposal) => void;
  commonMember: CommonMember | null;
}

export const isProposalWithHighlightedComment = (
  proposal: any
): proposal is ProposalWithHighlightedComment =>
  proposal && proposal.highlightedCommentId;

export const isDocInfo = (data: any): data is DocInfo => data.downloadURL;
