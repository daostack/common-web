import { Environment } from "./environment";
import { REACT_APP_ENV } from "./shared";

export const DYNAMIC_LINK_URI_PREFIX =
  REACT_APP_ENV === Environment.Production
    ? "https://app.common.io"
    : "https://staging.common.io";

export enum DynamicLinkType {
  Common = "common",
  Proposal = "proposal",
  Discussion = "discussion",
  DiscussionMessage = "discussionMessage",
  ProposalComment = "proposalComment",
}
