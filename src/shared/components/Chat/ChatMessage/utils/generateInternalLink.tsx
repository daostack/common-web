import React from "react";
import { DiscussionService, ProposalService } from "@/services";
import CommonFeed from "@/services/CommonFeed";
import { BASE_URL } from "@/shared/constants";
import { CommonFeedType, Text } from "@/shared/models";
import { InternalLinkData } from "@/shared/utils";
import { getCommonPagePath } from "@/shared/utils";
import { parseMessageLink } from "@/shared/utils";
import { getCommon } from "./getCommon";
import { renderLink } from "./renderLink";
import styles from "../ChatMessage.module.scss";

interface GenerateInternalLinkProps {
  text: string;
  onInternalLinkClick?: (data: InternalLinkData) => void;
}

const ITEM_KEY = "item";
const DISCUSSION_ITEM_KEY = "discussionItem";

export const getQueryParam = (path: string, key: string): string | null => {
  const urlParams = new URLSearchParams(path);

  return urlParams.get(key);
};

const getStreamNameByFeedItemId = async (
  commonId: string,
  feedItemId: string | null,
): Promise<string | undefined> => {
  const feetItem = feedItemId
    ? await CommonFeed.getCommonFeedItemById(commonId, feedItemId)
    : null;

  if (!feetItem?.data) {
    return;
  }

  if (feetItem?.data.type === CommonFeedType.Discussion) {
    const item = await DiscussionService.getDiscussionById(feetItem?.data.id);
    return item?.title;
  } else if (feetItem?.data.type === CommonFeedType.Proposal) {
    const item = await ProposalService.getProposalById(feetItem?.data.id);
    return item?.discussion?.title;
  }
};

const getDiscussionTitle = async (
  discussionId: string,
): Promise<string | undefined> => {
  const discussion = await DiscussionService.getDiscussionById(discussionId);

  return discussion?.title;
};



export const generateInternalLink = async ({
  text,
  onInternalLinkClick,
}: GenerateInternalLinkProps): Promise<Text> => {
  const commonPath = text.split("/").pop();
  if (text.startsWith(BASE_URL) && commonPath) {
    const [commonId, itemQueryParam] = commonPath.split("?");
    const itemId = getQueryParam(itemQueryParam, ITEM_KEY);
    const discussionItemId = getQueryParam(itemQueryParam, DISCUSSION_ITEM_KEY);
    if (commonId) {
      const common = await getCommon(commonId);
      if (common?.id && common.name) {
        const itemTitle = discussionItemId ? await getDiscussionTitle(discussionItemId) : await getStreamNameByFeedItemId(commonId, itemId);
        
        return (
          <>
            {renderLink({
              to: getCommonPagePath(common?.id, {
                ...(itemId && { item: itemId }),
              }),
              name: itemTitle ?? common.name,
              onClick: (event) => {
                const parsedLinkData = parseMessageLink(text);

                if (onInternalLinkClick && parsedLinkData) {
                  event.preventDefault();
                }

                onInternalLinkClick &&
                  parsedLinkData &&
                  onInternalLinkClick(parsedLinkData);
              },
              className: styles.internalLink,
            })}{" "}
          </>
        );
      }
    }
  }

  return `${text} `;
};
