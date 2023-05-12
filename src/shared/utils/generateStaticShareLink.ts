import { DYNAMIC_LINK_URI_PREFIX, DynamicLinkType } from "../constants";
import { Common, Discussion, DiscussionMessage, Proposal } from "../models";

export const generateStaticShareLink = (
  linkType: DynamicLinkType,
  elem: Common | Proposal | Discussion | DiscussionMessage,
  feedItemId?: string,
) => {
  switch (linkType) {
    case DynamicLinkType.DiscussionMessage:
    case DynamicLinkType.ProposalComment:
      elem = elem as DiscussionMessage;
      return `${DYNAMIC_LINK_URI_PREFIX}/commons/${elem.commonId}?item=${feedItemId}&message=${elem.id}`;
  }
};
