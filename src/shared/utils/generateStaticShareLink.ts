import { Environment, REACT_APP_ENV } from "../constants";
import { Common, Discussion, DiscussionMessage, Proposal } from "../models";

const staticLinkPrefix = () => {
  if (location.hostname === "localhost") {
    return "http://localhost:3000";
  }
  switch (REACT_APP_ENV) {
    case Environment.Dev:
      return "https://web-dev.common.io";
    case Environment.Stage:
      return "https://web-staging.common.io";
    case Environment.Production:
      return "https://app.common.io";
  }
};

export const enum StaticLinkType {
  DiscussionMessage,
  ProposalComment,
  Proposal,
  Discussion,
}

/**
 * TODO: handle the rest of the link types.
 */
export const generateStaticShareLink = (
  linkType: StaticLinkType,
  elem: Common | Proposal | Discussion | DiscussionMessage,
  feedItemId?: string,
) => {
  switch (linkType) {
    case StaticLinkType.DiscussionMessage:
    case StaticLinkType.ProposalComment:
      elem = elem as DiscussionMessage;
      return `${staticLinkPrefix()}/commons/${
        elem.commonId
      }?item=${feedItemId}&message=${elem.id}`;
  }
};
