export const DYNAMIC_LINK_URI_PREFIX =
  (process.env.REACT_APP_ENV === "production")
    ? "https://app.common.io"
    : "https://staging.common.io";

export enum DynamicLinkType {
  Common = "common",
  Proposal = "proposal",
  Discussion = "discussion",
  DiscussionMessage = "discussionMessage",
  ProposalComment = "proposalComment",
}
