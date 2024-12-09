import { Environment, REACT_APP_ENV, ROUTE_PATHS } from "../constants";
import { Common, Discussion, DiscussionMessage, Proposal } from "../models";
import { matchRoute } from "./matchRoute";

export const staticLinkPrefix = () => {
  if (window.location.hostname === "localhost") {
    return "http://localhost:3000";
  }
  switch (REACT_APP_ENV) {
    case Environment.Dev:
      return "https://web-dev.common.io";
    case Environment.Stage:
      return "https://web-staging.common.io";
    case Environment.Production:
      return "https://common.io";
  }
};

const getStaticLinkBasePath = (): string => {
  const pathname: string = window.location.pathname;

  if (matchRoute(pathname, ROUTE_PATHS.COMMON)) {
    return "commons";
  }

  if (matchRoute(pathname, ROUTE_PATHS.V04_COMMON)) {
    return "commons-v04";
  }

  if (matchRoute(pathname, ROUTE_PATHS.V03_COMMON)) {
    return "commons-v03";
  }

  return "commons";
};

export const enum StaticLinkType {
  DiscussionMessage,
  ProposalComment,
  Proposal,
  Discussion,
  Common,
}

export const generateStaticShareLink = (
  linkType: StaticLinkType,
  elem: Common | Proposal | Discussion | DiscussionMessage,
  feedItemId?: string,
): string => {
  const basePath: string = getStaticLinkBasePath();

  if (!feedItemId && linkType === StaticLinkType.Common) {
    elem = elem as Common;
    return `${staticLinkPrefix()}/${basePath}/${elem.id}`;
  }

  switch (linkType) {
    case StaticLinkType.Proposal:
    case StaticLinkType.Discussion:
      elem = elem as Discussion;
      return `${staticLinkPrefix()}/${basePath}/${
        elem.commonId
      }?item=${feedItemId}`;
    case StaticLinkType.DiscussionMessage:
    case StaticLinkType.ProposalComment:
      elem = elem as DiscussionMessage;
      return `${staticLinkPrefix()}/${basePath}/${
        elem.commonId
      }?item=${feedItemId}&message=${elem.id}`;
    default:
      return "";
  }
};

export const generateDiscussionShareLink = (
  commonId: string,
  discussionId: string,
): string => {
  const basePath: string = getStaticLinkBasePath();

  return `${staticLinkPrefix()}/${basePath}/${
    commonId
  }?discussionItem=${discussionId}`;
};